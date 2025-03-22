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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToQueue = exports.producer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: [process.env.KAFKA_BROKER || ""],
    ssl: {},
    sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME || "",
        password: process.env.KAFKA_PASSWORD || "",
    },
});
exports.producer = kafka.producer();
const connectToQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.producer.connect();
        console.log("Connected to Kafka producer");
    }
    catch (error) {
        console.error("Error connecting to Kafka producer:", error);
    }
});
exports.connectToQueue = connectToQueue;
