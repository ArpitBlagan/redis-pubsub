import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";
export class Pubsub {
  private static pubsubInstance: Pubsub | undefined;
  private redisSub: RedisClientType;
  public subsRecord: Map<WebSocket, string[]>;
  public redisPub: RedisClientType;

  private constructor() {
    this.redisSub = createClient();
    this.redisPub = createClient();
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
  delSub(ws: WebSocket) {
    const ff = this.subsRecord.get(ws);
    console.log(ff);
    if (ff) {
      this.subsRecord.delete(ws);
    }
  }
  subscribe(room: string, ws: WebSocket) {
    const ff = this.subsRecord.get(ws);
    if (ff && !ff?.includes(room)) {
      ff.push(room);
      this.subsRecord.set(ws, ff);
      this.redisSub.subscribe(room, (message) => {
        console.log(message);
      });
    }
  }
  unsubscribe(room: string, ws: WebSocket) {
    const ff = this.subsRecord.get(ws);
    if (ff) {
      const kk = ff.filter((ele) => {
        return ele != room;
      });
      this.subsRecord.set(ws, kk);
    }
  }
  publish(room: string, message: string) {
    this.redisPub.publish(room, message);
  }
}
