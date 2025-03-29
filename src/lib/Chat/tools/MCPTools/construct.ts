import { z } from "zod";

export const joke = z.object({
  url: z.string().describe("The valid URL"),
});
