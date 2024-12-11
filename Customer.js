class Customer {
    constructor(id, ticketPool, config) {
        this.id = id;
        this.ticketPool = ticketPool;
        this.config = config;
        this.isRunning = false;
        this.interval = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log(`Customer ${this.id} started`);

        const purchaseTickets = async () => {
            if (!this.isRunning) return;

            await this.ticketPool.removeTickets(
                this.id,
                this.config.getConfig().customerRetrievalRate
            );

            // Schedule next execution only if still running
            if (this.isRunning) {
                this.interval = setTimeout(purchaseTickets, 3000);
            }
        };

        // Start the first execution
        purchaseTickets();
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearTimeout(this.interval);
            this.interval = null;
        }
        console.log(`Customer ${this.id} stopped`);
    }
}

module.exports = Customer;
