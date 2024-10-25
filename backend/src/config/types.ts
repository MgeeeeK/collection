import { DataSource } from "typeorm";
import { PusherClient } from "~src/clients/pusher/client";

export interface Config {
  PORT: string;
  DATA_SOURCE: DataSource;
  PUSHER_CLIENT: PusherClient;
}
