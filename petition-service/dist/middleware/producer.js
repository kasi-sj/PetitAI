"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkaConfig_1 = require("../config/kafkaConfig");
const sendMessage = (message, topic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield kafkaConfig_1.producer.send({
            topic: topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(" Message sent:", message);
    }
    catch (error) {
        console.error(" Error sending message:", error);
    }
});
module.exports = sendMessage;
