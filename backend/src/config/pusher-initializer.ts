import { PusherClient } from "~src/clients/pusher/client";

export const initializePusher = () => {
  return new PusherClient();
};

