class TicketPool {
    constructor(config) {
        this.tickets = [];
        this.config = config;
        this.mutex = Promise.resolve();
        this.initialize();
    }

    initialize() {
        // Initialize with the total number of tickets from config
        const totalTickets = this.config.totalTickets;
        this.tickets = Array.from(
            { length: totalTickets },
            (_, i) => `Ticket${i + 1}`
        );
        console.log(`Initialized ticket pool with ${this.tickets.length} tickets`);
    }

    // Thread-safe method to add tickets
    async addTickets(vendorId, count) {
        return await this.mutex.then(async () => {
            try {
                if (this.tickets.length >= this.config.maxTicketCapacity) {
                    console.log(`Vendor-${vendorId} tried adding tickets, but the pool is full.`);
                    return false;
                }

                const addCount = Math.min(
                    count,
                    this.config.maxTicketCapacity - this.tickets.length
                );

                const startId = this.tickets.length + 1;
                const newTickets = Array.from(
                    { length: addCount },
                    (_, i) => `Ticket${startId + i}`
                );
                this.tickets.push(...newTickets);
                console.log(`Vendor-${vendorId} added ${addCount} tickets. Total tickets: ${this.tickets.length}`);
                return true;
            } finally {
                this.mutex = Promise.resolve();
            }
        });
    }

    // Thread-safe method to remove tickets
    async removeTickets(customerId, count) {
        return await this.mutex.then(async () => {
            try {
                if (this.tickets.length < count) {
                    console.log(`Customer-${customerId} failed to purchase tickets: Not enough tickets available.`);
                    return null;
                }

                const purchasedTickets = this.tickets.splice(0, count);
                console.log(`Customer-${customerId} purchased ${count} tickets: ${purchasedTickets.join(', ')}. Remaining tickets: ${this.tickets.length}`);
                return purchasedTickets;
            } finally {
                this.mutex = Promise.resolve();
            }
        });
    }

    getAvailableTickets() {
        return this.tickets.length;
    }

    getTickets() {
        return [...this.tickets];
    }
}

module.exports = TicketPool;
