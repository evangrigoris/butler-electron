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
exports.BalanceController = void 0;
const service_1 = require("./service");
class BalanceController {
    constructor() {
        this.balanceService = new service_1.BalanceService();
    }
    getBalances(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.balanceService.getBalances();
        });
    }
    getAllBalances(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.balanceService.getAllBalances();
        });
    }
}
exports.BalanceController = BalanceController;
