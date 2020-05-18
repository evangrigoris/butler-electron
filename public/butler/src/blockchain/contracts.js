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
const config_1 = require("./config");
const bitcoin_1 = require("./bitcoin");
const ethereum_1 = require("./ethereum");
const aeternity_1 = require("./aeternity");
const erc20_1 = require("./erc20");
let Contracts;
exports.default = () => {
    if (!Contracts) {
        const Config = config_1.default();
        const AllContracts = {
            ETH: Config.ETH && new ethereum_1.default(Config.ETH),
            BTC: Config.BTC && new bitcoin_1.default(Config.BTC),
            AE: Config.AE && new aeternity_1.default(Config.AE),
            DAI: Config.DAI && new erc20_1.default(Config.DAI),
            USDC: Config.USDC && new erc20_1.default(Config.USDC),
            WBTC: Config.WBTC && new erc20_1.default(Config.WBTC),
        };
        Contracts = Object.entries(AllContracts).reduce((a, [k, v]) => (v === undefined ? a : Object.assign(Object.assign({}, a), { [k]: v })), {});
    }
    return Contracts;
};
exports.startEventListener = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const network of Object.keys(Contracts)) {
        if (!config_1.SECONDARY_NETWORKS[network]) {
            yield Contracts[network].subscribe();
        }
    }
});
//# sourceMappingURL=contracts.js.map