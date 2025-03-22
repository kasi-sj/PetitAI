"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueueMessageSchema = void 0;
const zod_1 = require("zod");
exports.createQueueMessageSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.enum(["CategoryQueue", "InitializerQueue", "NotificationQueue", "RepetitiveQueue", "UserAssignerQueue"], {
            required_error: "Topic is required",
            invalid_type_error: "Invalid topic. Allowed values: CategoryQueue, InitializerQueue, NotificationQueue, RepetitiveQueue, UserAssignerQueue",
        }),
        content: zod_1.z.string().nonempty({ message: "Content is required" }),
    }),
});
