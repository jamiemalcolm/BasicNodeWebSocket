import { WebSocketServer, WebSocket } from "ws";

// creates its own internal HTTP server for the handshack
const wss = new WebSocketServer({ port: 8080 }); // creates Zombie Server that waits for a connection to happen on port 8080
// enterprise level this would be appended to an existing HTTP server that is already running on port 80 or 443

//Connection Event
//fires after 101 handshake is complete
//socket conntain the individual connection to the 1 client
// request contains headers (cookies IP address params-(url)) from request
wss.on('connection', (socket, request) => {
    const ip = request.socket.remoteAddress;

    socket.on('message', (rawData) => {
        const message = rawData.toString();
        console.log({ rawData });

        wss.clients.forEach((client) => {
            {
                // readyState 1 means the connection is open and ready to communicate
                if (client.readyState === WebSocket.OPEN) client.send(`Server Broadcast: ${message}`);
            }
        })
    });

    socket.on('error', (err) => {
        console.log(`ErrorL ${err.message}: ${ip}`);
    });

    socket.on('close', () => {
        console.log(`Client Disconnected: ${ip}`);
    });
});

console.log('WebSocket server is Live and running on ws://localhost:8080');