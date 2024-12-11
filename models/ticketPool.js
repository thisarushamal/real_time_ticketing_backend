class TicketPool {
    constructor(config) {
        this.tickets = Array.from({ length: config.totalTickets }, (_, i) => `Ticket${i + 1}`);
        this.maxCapacity = config.maxTicketCapacity;
    }

    addTickets(vendorId, count) {
        if (this.tickets.length + count > this.maxCapacity) {
            return { success: false, message: `Vendor-${vendorId} tried adding tickets, but the pool is full.` };
        }
        const addedTickets = Array.from({ length: count }, (_, i) => `Ticket${this.tickets.length + i + 1}`);
        this.tickets.push(...addedTickets);
        return { success: true, message: `Vendor-${vendorId} added ${count} tickets. Total tickets: ${this.tickets.length}.` };
    }

    purchaseTickets(customerId, count) {
        if (this.tickets.length < count) {
            return { success: false, message: `Customer-${customerId} tried purchasing ${count} tickets, but not enough were available.` };
        }
        const purchasedTickets = this.tickets.splice(0, count);
        return { success: true, tickets: purchasedTickets, message: `Customer-${customerId} purchased ${count} tickets: ${purchasedTickets.join(', ')}. Remaining tickets: ${this.tickets.length}.` };
    }

    getStatus() {
        return { availableTickets: this.tickets.length, tickets: this.tickets };
    }
}

module.exports = TicketPool;
