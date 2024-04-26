export class Eventer<E> {

    private eventListenersMap: Map<E, Array<Listener>>  = new Map();

    public on( event: E, listener: Listener ): void {

        let listeners = this.eventListenersMap.get( event );
        if( !listeners ) {
            listeners = [];
            this.eventListenersMap.set( event, listeners );
        }

        listeners.push( listener );

    }

    public trigger( event: E, ...args: any[] ): void {

        const listeners = this.eventListenersMap.get( event );
        if( !listeners ){
            return;
        }

        listeners.forEach(( listener ) => {
            listener(...args);
        });

    }

}