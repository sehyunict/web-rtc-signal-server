import express from 'express';
import {Server} from 'socket.io';
import * as https from "https";
import * as fs from "fs";
import {Client} from "./modules/Client";
import {ClientManager} from "./modules/manager/ClientManager";

const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
};


const app = express();
const server = https.createServer(options, app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const clientManager = new ClientManager();

io.on('connection', (socket) => {

    socket.broadcast.emit("connectNewClient", socket.id);
    console.log(`[${socket.id}.broadcast.emit][connectNewClient]`, socket.id);

    clientManager.add( new Client( socket ) );
    clientManager.print();

    /*
[소켓] ( 인자 )
1. [A] on connectNewClient ( B )
2. [A] emit sendOldClientOffer ( B, A-offer )
3. [B] on receiveOldClientOffer ( A, A-offer )
4. [B] emit sendNewClientOffer ( A, B-offer )

4. [A] on receiveNewClientOffer ( A, B-offer )
5. [A] on offer
 */

    socket.on('sendOldClientOffer', (receiveData: ISendOldClientOffer) => {
        console.log(`[${socket.id}.on][sendOldClientOffer]`, receiveData);

        const sendData = {
            oldClientId: socket.id,
            offer: receiveData.offer
        } as IReceiveOldClientOffer;

        const newClient = clientManager.getBySocketId( receiveData.newClientId ) as Client;
        const newClientSocket = newClient.getSocket();
        newClientSocket.emit( 'receiveOldClientOffer', sendData );
        console.log( `[${newClientSocket.id}.emit][receiveOldClientOffer]`, sendData );

    });

    socket.on( 'sendNewClientOffer', (receiveData: ISendNewClientOffer) => {
        console.log(`[${socket.id}.on][sendNewClientOffer]`, receiveData);

        const sendData = {
            newClientId: socket.id,
            offer: receiveData.offer
        } as IReceiveNewClientOffer;

        const newClient = clientManager.getBySocketId( receiveData.newClientId ) as Client;
        const newClientSocket = newClient.getSocket();
        newClientSocket.emit( 'receiveNewClientOffer', sendData );
        console.log( `[${newClientSocket.id}.emit][receiveNewClientOffer]`, sendData );
    } );


    socket.on('disconnect', () => {
        clientManager.removeBySocketId( socket.id );
        clientManager.print();
    });

});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});