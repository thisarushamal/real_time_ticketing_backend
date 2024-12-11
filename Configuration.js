const fs = require('fs');
const path = require('path');

class Configuration {
    constructor() {
        this.config = {
            totalTickets: 100,
            ticketReleaseRate: 5,
            customerRetrievalRate: 4,
            maxTicketCapacity: 100
        };
        this.configPath = path.join(__dirname, 'config.json');
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = fs.readFileSync(this.configPath, 'utf8');
                this.config = JSON.parse(data);
                console.log('Configuration loaded:', this.config);
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            console.log('Configuration saved:', this.config);
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }

    updateConfig(newConfig) {
        // Validate configuration
        if (!this.validateConfig(newConfig)) {
            throw new Error('Invalid configuration');
        }

        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
        return this.config;
    }

    validateConfig(config) {
        const requiredFields = ['totalTickets', 'ticketReleaseRate', 'customerRetrievalRate', 'maxTicketCapacity'];
        
        // Check if all required fields are present and positive
        for (const field of requiredFields) {
            if (!(field in config) || typeof config[field] !== 'number' || config[field] <= 0) {
                return false;
            }
        }

        // Check if totalTickets doesn't exceed maxTicketCapacity
        if (config.totalTickets > config.maxTicketCapacity) {
            return false;
        }

        return true;
    }

    getConfig() {
        return this.config;
    }
}

module.exports = Configuration;
