import dataSource from "~src/config/ormconfig";

export const initializeDataSource = async () => {
  await dataSource
    .initialize()
    .then(() => console.log(`datasource has been initialized!`));
};
