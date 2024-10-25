declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      FRONTEND_URL: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      DB_PORT: string;
      DB_USER: string;
      DB_HOST: string;
      DB_SSL: string;
      PUSHER_CLUSTER: string;
      PUSHER_SECRET: string;
      PUSHER_KEY: string;
      PUSHER_APP_ID: string;
    }
  }
}

export {};
