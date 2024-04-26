import {Manager} from "./Manager";
import {Client} from "../Client";

export class ClientManager extends Manager<Client> implements IUseToString {

    constructor() {

        super();

        super.on("beforePrint", () => {
            console.log( "[클라이언트 목록]" );
            console.log( "------------------------------------------------" );
        });
        super.on("afterPrint", () => {
            console.log( "------------------------------------------------" );
        });

    }

    getBySocketId( socketId: string ) {

        return super.list().find(( client: Client ) => {

            return client.getSocket().id === socketId;

        });

    }

    getOffers(): Array<RTCSessionDescriptionInit> {

        return super.list().reduce(( offers: Array<RTCSessionDescriptionInit>, client: Client ) => {

            const offer = client.getOffer();
            if( !offer ){
                return offers;
            }

            offers.push( offer );
            return offers;

        }, []);

    }

    removeBySocketId( socketId: string ): void {

        const client = this.getBySocketId( socketId );
        if( !client ){
            return;
        }

        super.remove( client );
    }

}