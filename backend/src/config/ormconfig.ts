import { DataSource, DataSourceOptions } from "typeorm";
import { Node } from "~src/svc/modules/node/entitites/node";
import { Session } from "~src/svc/modules/session/entities/session";

const config: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true",
  synchronize: false,
  ...(process.env.DB_SSL === "true" && {
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  connectTimeoutMS: 15 * 1000,
  maxQueryExecutionTime: 60 * 1000,
  entities: [Node, Session],
  migrations: ["dist/src/svc/migrations/*.{ts,js}"],
  migrationsTableName: "migrations_typeorm",
  migrationsRun: false,
};

const dataSource = new DataSource(config);

export default dataSource;
