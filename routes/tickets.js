const fs = require('fs-extra');
const path = require('path');
const TicketPool = require('../models/ticketPool');

const configPath = path.join(__dirname, '../data/config.json');
let config = {};
if (fs.existsSync(configPath)) {
    config = fs.readJsonSync(configPath);
} else {
    config = { totalTickets: 0, ticketReleaseRate: 5, customerRetrievalRate: 3, maxTicketCapacity: 20 };
    fs.writeJsonSync(configPath, config);
}

// Initialize TicketPool
let ticketPool = new TicketPool(config);

const handleTicketsRoute = async (req, res, parsedUrl) => {
    const method = req.method;
    const pathname = parsedUrl.pathname;

    if (pathname === '/tickets/status' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(ticketPool.getStatus()));
    } else if (pathname === '/tickets/vendor/add' && method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            const { vendorId, count } = JSON.parse(body);
            const result = ticketPool.addTickets(vendorId, count);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    } else if (pathname === '/tickets/customer/buy' && method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            const { customerId, count } = JSON.parse(body);
            const result = ticketPool.purchaseTickets(customerId, count);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    } else if (pathname === '/tickets/config' && method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            const newConfig = JSON.parse(body);

            if (newConfig.totalTickets > newConfig.maxTicketCapacity) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Total tickets cannot exceed max capacity.' }));
                return;
            }

            config = newConfig;
            await fs.writeJson(configPath, config);

            // Reinitialize TicketPool
            ticketPool = new TicketPool(config);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Configuration updated successfully.', config }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Route not found' }));
    }
};

module.exports = { handleTicketsRoute };
