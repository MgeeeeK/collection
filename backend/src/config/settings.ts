import defaultDataSource from "~src/config/ormconfig";
import { initializePusher } from "~src/config/pusher-initializer";
import { Config } from "~src/config/types";

export const conf: Config = {
  PORT: process.env.PORT,
  DATA_SOURCE: defaultDataSource,
  PUSHER_CLIENT: initializePusher(),
};
