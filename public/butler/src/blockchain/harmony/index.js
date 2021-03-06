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
const harmony_1 = require("@jelly-swap/harmony");
const providers_1 = require("@jelly-swap/harmony/dist/src/providers");
const math_1 = require("../../utils/math");
class EthereumContract extends harmony_1.Contract {
    constructor(config) {
        const _wallet = new providers_1.WalletProvider(config.providerUrl, config.chainId, config.PRIVATE_KEY);
        super(_wallet, config);
        this.wallet = _wallet;
    }
    // TODO: Implement message signing.
    // async signMessage(message: string) {
    // return await this.wallet.signMessage(message);
    // }
    userWithdraw(swap, secret) {
        const _super = Object.create(null, {
            getBalance: { get: () => super.getBalance },
            withdraw: { get: () => super.withdraw }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const address = swap.receiver;
            const balance = yield _super.getBalance.call(this, address);
            const isBalanceZero = math_1.greaterThan(balance, 0);
            if (!isBalanceZero) {
                const result = yield _super.withdraw.call(this, Object.assign(Object.assign({}, swap), { secret }));
                return result;
            }
        });
    }
}
exports.default = EthereumContract;
