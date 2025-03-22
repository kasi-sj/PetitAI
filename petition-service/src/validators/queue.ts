import { z } from "zod";

export const createQueueMessageSchema = z.object({
  body: z.object({
    topic: z.enum(
      ["CategoryQueue", "InitializerQueue", "NotificationQueue", "RepetitiveQueue", "UserAssignerQueue"],
      {
        required_error: "Topic is required",
        invalid_type_error: "Invalid topic. Allowed values: CategoryQueue, InitializerQueue, NotificationQueue, RepetitiveQueue, UserAssignerQueue",
      }
    ),
    content: z.string().nonempty({ message: "Content is required" }),
  }),
});
