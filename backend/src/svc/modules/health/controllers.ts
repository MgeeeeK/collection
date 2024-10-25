import { Request, Response } from "express";

export const getHealthCheck = (_: Request, response: Response) => {
  response.json({
    message: "Health check successful",
    data: "OK",
  });
};
