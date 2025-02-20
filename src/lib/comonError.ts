// src/lib/CustomError.ts
export default class ComonError extends Error {
  data: any;

  constructor(message: string, data?: any) {
    super(message);
    this.data = data;
    this.name = "CustomError";
  }
}
