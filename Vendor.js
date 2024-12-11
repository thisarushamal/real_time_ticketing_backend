class Vendor {
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
        console.log(`Vendor ${this.id} started`);

        const addTickets = async () => {
            if (!this.isRunning) return;

            await this.ticketPool.addTickets(
                this.id,
                this.config.getConfig().ticketReleaseRate
            );

            // Schedule next execution only if still running
            if (this.isRunning) {
                this.interval = setTimeout(addTickets, 2000);
            }
        };

        // Start the first execution
        addTickets();
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearTimeout(this.interval);
            this.interval = null;
        }
        console.log(`Vendor ${this.id} stopped`);
    }
}

module.exports = Vendor;
