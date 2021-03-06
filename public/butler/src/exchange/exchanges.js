"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("./binance"));
const mock_1 = __importDefault(require("./mock"));
exports.default = {
    Binance: binance_1.default,
    mock: mock_1.default,
};
