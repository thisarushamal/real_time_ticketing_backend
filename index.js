const http = require('http');
const url = require('url');
const fs = require('fs');

// Define CORS headers
const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow GET, POST, and OPTIONS methods
    'Access-Control-Allow-Headers': 'Content-Type', // Allow Content-Type header
};

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        // Handle CORS preflight requests
        res.writeHead(204, headers);
        res.end();
        return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.writeHead(200, { 'Content-Type': 'application/json' });

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Example: Handle `/tickets/status` endpoint
    if (pathname === '/tickets/status' && req.method === 'GET') {
        // Example response for ticket status
        const ticketStatus = {
            availableTickets: 10,
            tickets: [1, 2, 3, 4, 5],
        };

        res.end(JSON.stringify(ticketStatus));
    }
    // Add your other routes here
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(5001, () => {
    console.log('Backend is running on http://localhost:5001');
});
