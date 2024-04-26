import {Eventer} from "../Eventer";
type Event = "beforePrint" | "afterPrint";

export class Manager<T extends IUseToString> {

    private items: Array<T> = [];

    private eventer: Eventer<Event> = new Eventer<Event>();

    public add( item: T ): void {
        this.items.push( item );
    }

    public remove( targetItem: T ): void {
        const index = this.items.findIndex( ( item ) => {
            return item === targetItem;
        } );

        if( index < 0 ){
            return;
        }

        this.items.splice( index, 1 );
    }

    public on( event: Event, listener: Listener ): void {
        this.eventer.on( event, listener );
    }

    public list(): Array<T> {
        return this.items.slice();
    }

    public print(): void {

        this.eventer.trigger( "beforePrint" );
        this.items.forEach(( item: T ) => {
            console.log( item.toString() );
        });
        this.eventer.trigger( "afterPrint" );

    }

}