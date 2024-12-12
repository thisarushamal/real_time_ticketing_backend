# Real-Time Ticketing System Backend

A pure Node.js backend service for the real-time ticketing system, providing WebSocket support for real-time updates and RESTful APIs for ticket management.

## Features

- Real-time ticket processing and updates
- WebSocket server for live communication
- RESTful API endpoints for ticket management
- Configuration management
- Logging system
- Scalable architecture

## Tech Stack

- Node.js (v14 or higher)
- Native WebSocket implementation
- File system for data persistence
- Custom routing implementation

## Project Structure

```
.
├── src/
│   ├── index.js           # Main application entry point
│   ├── websocket/         # WebSocket server implementation
│   ├── routes/            # API route handlers
│   └── utils/             # Utility functions
├── config/                # Configuration files
├── logs/                  # Application logs
├── package.json           # Project configuration and dependencies
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone this repository
2. Install dependencies:
```bash
npm install
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

### WebSocket Events

- `connection`: Initial WebSocket connection
- `ticket`: Real-time ticket updates
- `configuration`: System configuration updates
- `log`: Log message updates

### REST Endpoints

- `GET /api/tickets`: Retrieve all tickets
- `POST /api/tickets`: Create a new ticket
- `PUT /api/tickets/:id`: Update ticket status
- `GET /api/configuration`: Get system configuration
- `POST /api/configuration`: Update system configuration

## Configuration

The server can be configured through environment variables or config files:

- `PORT`: Server port (default: 3000)
- `WS_PORT`: WebSocket port (default: 8080)
- `LOG_LEVEL`: Logging level (default: 'info')

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
