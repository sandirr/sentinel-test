import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import path from "path";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("message", (raw) => {
    try {
      const message: ChatMessage = JSON.parse(raw.toString());
      const payload = JSON.stringify(message);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    } catch {
      // ignore
    }
  });

  ws.on("close", () => clients.delete(ws));
});

const distPath = path.join(__dirname, "../../client/dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));
