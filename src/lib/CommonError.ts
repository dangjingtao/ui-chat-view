// src/lib/CustomError.ts
import logger from "@/lib/logger";

logger.setLevel("error");
export default class CommonError extends Error {
  data: any;

  constructor(message: string, data?: any) {
    super(message);
    this.data = data;
    this.name = "CustomError";
    logger.error(message, data);
  }
}
