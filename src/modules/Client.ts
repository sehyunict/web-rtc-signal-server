import {Socket} from "socket.io";

export class Client {

    private socket: Socket;
    private offer?: RTCSessionDescriptionInit;

    constructor( socket: Socket ) {
        this.socket = socket;
    }
    public getSocket(): Socket {
        return this.socket;
    }

    public getOffer(): RTCSessionDescriptionInit | undefined {
        return this.offer;
    }

    public setOffer( offer: RTCSessionDescriptionInit ): void {
        this.offer = offer;
    }

    toString(): string {
        return `{ id: ${ this.getSocket().id }, hasOffer: ${ !!this.offer } }`;
    }

}