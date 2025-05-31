export class WebSocketHandler {
    constructor(url, onMessage, onOpen, onError, onClose) {
        this.url = url;
        this.onMessage = onMessage;
        this.onOpen = onOpen;
        this.onError = onError;
        this.onClose = onClose;
        this.socket = null;
        this.heartbeatInterval = null;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', (event) => {
            console.log('Connected to the server');
            if (this.onOpen) this.onOpen(event);
            this.startHeartbeat(); // Start heartbeat when connected
        });

        this.socket.addEventListener('message', (event) => {
            if (this.onMessage) this.onMessage(event);
        });

        this.socket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            if (this.onError) this.onError(event);
        });

        this.socket.addEventListener('close', (event) => {
            console.log('Disconnected from the server');
            this.stopHeartbeat(); // Stop heartbeat on disconnect
            if (this.onClose) this.onClose(event);
        });
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
        this.stopHeartbeat(); // Ensure heartbeat is stopped
    }

    startHeartbeat(interval = 30000) {
        this.heartbeatInterval = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                console.log('Sending hearbeat ping...')
                this.socket.send(JSON.stringify({ type: 'ping' }));
            }
        }, interval);
    }

    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}
