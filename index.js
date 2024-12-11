const http = require('http');
const Configuration = require('./Configuration');
const TicketPool = require('./TicketPool');
const Vendor = require('./Vendor');
const Customer = require('./Customer');

// System components
let isRunning = false;
const config = new Configuration();
let ticketPool = null;
let vendors = [];
let customers = [];

const VENDOR_COUNT = 5;
const CUSTOMER_COUNT = 3;

// Initialize system
function initializeSystem() {
    // Create new ticket pool with current configuration
    ticketPool = new TicketPool(config.getConfig());
    
    // Initialize vendors
    vendors = Array.from({ length: VENDOR_COUNT }, (_, i) => 
        new Vendor(i + 1, ticketPool, config)
    );
    
    // Initialize customers
    customers = Array.from({ length: CUSTOMER_COUNT }, (_, i) => 
        new Customer(i + 1, ticketPool, config)
    );

    console.log('System initialized with:', {
        ticketCount: ticketPool.getAvailableTickets(),
        vendorCount: vendors.length,
        customerCount: customers.length,
        config: config.getConfig()
    });
}

// Start/Stop system
function startSystem() {
    if (!isRunning) {
        console.log('Starting system...');
        isRunning = true;
        initializeSystem();
        
        // Start vendors and customers
        vendors.forEach(vendor => vendor.start());
        customers.forEach(customer => customer.start());
        
        console.log('System started.');
        return true;
    }
    return false;
}

function stopSystem() {
    if (isRunning) {
        console.log('Stopping system...');
        isRunning = false;
        
        // Stop vendors and customers
        vendors.forEach(vendor => vendor.stop());
        customers.forEach(customer => customer.stop());
        
        // Clear arrays
        vendors = [];
        customers = [];
        ticketPool = null;
        
        console.log('System stopped.');
        return true;
    }
    return false;
}

// Create HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const baseResponse = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        try {
            if (req.url === '/start' && req.method === 'POST') {
                const success = startSystem();
                res.writeHead(200, baseResponse.headers);
                res.end(JSON.stringify({ success }));
            }
            else if (req.url === '/stop' && req.method === 'POST') {
                const success = stopSystem();
                res.writeHead(200, baseResponse.headers);
                res.end(JSON.stringify({ success }));
            }
            else if (req.url === '/status' && req.method === 'GET') {
                const status = {
                    running: isRunning,
                    availableTickets: ticketPool ? ticketPool.getAvailableTickets() : 0,
                    tickets: ticketPool ? ticketPool.getTickets() : [],
                    config: config.getConfig()
                };
                res.writeHead(200, baseResponse.headers);
                res.end(JSON.stringify(status));
            }
            else if (req.url === '/config' && req.method === 'POST') {
                const newConfig = JSON.parse(body);
                const updatedConfig = config.updateConfig(newConfig);
                res.writeHead(200, baseResponse.headers);
                res.end(JSON.stringify({ 
                    success: true, 
                    config: updatedConfig 
                }));
            }
            else {
                res.writeHead(404, baseResponse.headers);
                res.end(JSON.stringify({ error: 'Not found' }));
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, baseResponse.headers);
            res.end(JSON.stringify({ 
                success: false, 
                error: error.message 
            }));
        }
    });
});

const PORT = 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
