"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pubsub = void 0;
const redis_1 = require("redis");
class Pubsub {
    constructor() {
        this.redisSub = (0, redis_1.createClient)();
        this.redisPub = (0, redis_1.createClient)();
        this.redisPub.connect();
        this.redisSub.connect();
        this.subsRecord = new Map();
        this.redisSub.on("message", (channel, message) => {
            for (const [key, value] of this.subsRecord) {
                if (value.includes(channel)) {
                    key.send(JSON.stringify(message));
                }
            }
        });
    }
    static getInstance() {
        if (!this.pubsubInstance) {
            return (this.pubsubInstance = new Pubsub());
        }
        return this.pubsubInstance;
    }
    delSub(ws) {
        const ff = this.subsRecord.get(ws);
        console.log(ff);
        if (ff) {
            this.subsRecord.delete(ws);
        }
    }
    subscribe(room, ws) {
        const ff = this.subsRecord.get(ws);
        if (ff && !(ff === null || ff === void 0 ? void 0 : ff.includes(room))) {
            ff.push(room);
            this.subsRecord.set(ws, ff);
            this.redisSub.subscribe(room, (message) => {
                console.log(message);
            });
        }
    }
    unsubscribe(room, ws) {
        const ff = this.subsRecord.get(ws);
        if (ff) {
            const kk = ff.filter((ele) => {
                return ele != room;
            });
            this.subsRecord.set(ws, kk);
        }
    }
    publish(room, message) {
        this.redisPub.publish(room, message);
    }
}
exports.Pubsub = Pubsub;
