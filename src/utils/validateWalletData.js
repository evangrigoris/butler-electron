import { getNetworkRegex } from './addressValidation';
import { ERC20_TOKENS } from '../constants';

export const checkIfSecretIsMissing = wallets => {
  for (const wallet in wallets) {
    if (!wallets[wallet].secret) {
      return true;
    }
  }
};

export const checkIfAddressessDoNotMatchRegex = wallets => {
  for (const wallet in wallets) {
    if (!new RegExp(getNetworkRegex(wallet)).test(wallets[wallet].address)) {
      return true;
    }
  }
};

export const checkIfETHSecretMatchERC20Secret = (wallets, setERC20InvalidSecret) => {
  const ethWallet = wallets?.ETH;

  if (ethWallet) {
    const { secret } = ethWallet;

    for (const token in ERC20_TOKENS) {
      if (wallets[token]?.secret === secret) {
        setERC20InvalidSecret(tokens => ({
          ...tokens,
          [token]: true,
        }));
        return true;
      } else {
        setERC20InvalidSecret(tokens => ({
          ...tokens,
          [token]: false,
        }));
      }
    }
  }
};

export const checkIfETHAddressMatchERC20Address = (wallets, setERC20InvalidAddress) => {
  const ethWallet = wallets?.ETH;

  if (ethWallet) {
    const { address } = ethWallet;

    for (const token in ERC20_TOKENS) {
      if (wallets[token]?.address === address) {
        setERC20InvalidAddress(tokens => ({
          ...tokens,
          [token]: true,
        }));

        return true;
      } else {
        setERC20InvalidAddress(tokens => ({
          ...tokens,
          [token]: false,
        }));
      }
    }
  }
};