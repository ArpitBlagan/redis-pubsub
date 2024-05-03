import express, { Request, Response } from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { Pubsub } from "./pubsubManager";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/get", async (req: Request, res: Response) => {
  res.status(200).json({ message: "working..." });
});

wss.on("connection", (ws, req) => {
  ws.on("message", (data: any) => {
    const message = JSON.parse(data);
    if (message.type == "subscribe") {
      Pubsub.getInstance().subscribe(message.room, ws);
    } else if (message.type == "unsubscribe") {
      Pubsub.getInstance().unsubscribe(message.room, ws);
    } else if (message.type == "publish") {
      Pubsub.getInstance().publish(message.room, message.text);
    } else {
      console.log(message);
    }
  });
  ws.on("close", () => {
    console.log("connection closed");
    Pubsub.getInstance().delSub(ws);
  });
});
server.listen(8000, () => {
  console.log(`${Date.now().toLocaleString()} server listening on port 8000`);
});
