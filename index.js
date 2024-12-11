const http = require('http');
const url = require('url');

// In-memory storage for tickets and configuration
let ticketState = {
    availableTickets: 10,
    tickets: [1, 2, 3, 4, 5],
    config: {}
};

// Helper function to parse JSON body from requests
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
};

const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
        // GET /status endpoint
        if (pathname === '/status' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                availableTickets: ticketState.availableTickets,
                tickets: ticketState.tickets
            }));
        }
        // POST /vendor/add endpoint
        else if (pathname === '/vendor/add' && req.method === 'POST') {
            const body = await getRequestBody(req);
            const { vendorId, count } = body;
            
            if (!vendorId || !count || typeof count !== 'number') {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid vendorId or count' }));
                return;
            }

            // Add new tickets
            const newTickets = Array.from(
                { length: count }, 
                (_, i) => ticketState.tickets.length + i + 1
            );
            ticketState.tickets.push(...newTickets);
            ticketState.availableTickets += count;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
                success: true, 
                addedTickets: count,
                currentAvailable: ticketState.availableTickets 
            }));
        }
        // POST /customer/buy endpoint
        else if (pathname === '/customer/buy' && req.method === 'POST') {
            const body = await getRequestBody(req);
            const { customerId, count } = body;

            if (!customerId || !count || typeof count !== 'number') {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid customerId or count' }));
                return;
            }

            if (count > ticketState.availableTickets) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Not enough tickets available' }));
                return;
            }

            // Process ticket purchase
            const purchasedTickets = ticketState.tickets.splice(0, count);
            ticketState.availableTickets -= count;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
                success: true, 
                purchasedTickets,
                remainingTickets: ticketState.availableTickets 
            }));
        }
        // POST /config endpoint
        else if (pathname === '/config' && req.method === 'POST') {
            const newConfig = await getRequestBody(req);
            
            // Update configuration
            ticketState.config = { ...ticketState.config, ...newConfig };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
                success: true, 
                currentConfig: ticketState.config 
            }));
        }
        // Handle 404 Not Found
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    } catch (error) {
        // Handle any internal errors
        console.error('Error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

const PORT = 5001;
server.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});
