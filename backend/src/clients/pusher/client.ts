import Pusher from "pusher";

export class PusherClient {
  #pusher: Pusher;

  constructor() {
    this.#pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }

  async trigger(channel: string, event: string, data: any): Promise<void> {
    await this.#pusher.trigger(channel, event, data);
  }
}
