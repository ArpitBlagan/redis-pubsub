"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const pubsubManager_1 = require("./pubsubManager");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws, req) => {
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        if (message.type == "subscribe") {
            pubsubManager_1.Pubsub.getInstance().subscribe(message.room, ws);
        }
        else if (message.type == "unsubscribe") {
            pubsubManager_1.Pubsub.getInstance().unsubscribe(message.room, ws);
        }
        else if (message.type == "publish") {
            pubsubManager_1.Pubsub.getInstance().publish(message.room, message.text);
        }
        else {
            console.log(message);
        }
    });
    ws.on("close", () => {
        console.log("connection closed");
        pubsubManager_1.Pubsub.getInstance().delSub(ws);
    });
});
server.listen(8000, () => {
    console.log(`${Date.now().toLocaleString()} server listening on port 8000`);
});
