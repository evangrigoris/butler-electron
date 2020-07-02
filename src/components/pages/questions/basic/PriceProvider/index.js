import React, { useState, useEffect } from 'react';

import Input from '../../../../common/Input';
import QuestionTitle from '../../../../common/QuestionTitle';

import { PRICE_PROVIERS, PRICE_PROVIDER_INTERVALS } from '../../../../../constants';

import { useGetStateFromCP } from '../../../../../hooks/useGetStateFromCP';

import './style.scss';
import Emitter from '../../../../../utils/emitter';

const GENERATE_KEY_URL = {
  CryptoCompare: 'https://www.cryptocompare.com/cryptopian/api-keys',
  Binance: 'https://binance.zendesk.com/hc/en-us/articles/360002502072-How-to-create-API',
};

/*eslint no-useless-concat: "off"*/

const PriceProvider = ({ valid, selectedPriceProvider, isButlerStarted, getState }) => {
  const [priceProvider, setPriceProvider] = useState({
    CryptoCompare: {
      apiKey: '',
      interval: 30,
    },
  });
  const [apiFromRebalance, setApiFromRebalance] = useState('');
  const [secretFromRebalance, setSecretFromRebalance] = useState('');
  const [isIntervalOpen, setIsIntervalOpen] = useState(false);
  const [isValid, setIsValid] = useState();

  useEffect(() => {
    if (valid) {
      setIsValid(valid);
    }
  }, [valid]);

  const getSelectedPriceProvider = () => {
    return Object.keys(priceProvider)[0];
  };

  useEffect(() => {
    if (!selectedPriceProvider) {
      setPriceProvider({
        CryptoCompare: {
          apiKey: '',
          interval: 30,
        },
      });

      return;
    }

    const { PROVIDER, API_KEY, SECRET_KEY, UPDATE_INTERVAL } = selectedPriceProvider;

    setPriceProvider({
      [PROVIDER]: {
        apiKey: API_KEY,
        secretKey: SECRET_KEY,
        interval: UPDATE_INTERVAL,
      },
    });
  }, [selectedPriceProvider]);

  useEffect(() => {
    new Emitter().on('onRebalanceChange', rebalance => {
      if (rebalance && Object.keys(rebalance).length) {
        const { apiKey, secretKey } = rebalance.Binance;

        setApiFromRebalance(apiKey);
        setSecretFromRebalance(secretKey);
      } else if (!rebalance && getSelectedPriceProvider() !== 'Binance') {
        setApiFromRebalance('');
        setSecretFromRebalance('');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const keys = priceProvider && Object.keys(priceProvider);

    if (keys.length && keys[0] === 'Binance') {
      setPriceProvider({
        Binance: {
          interval: priceProvider.Binance.interval,
          apiKey: apiFromRebalance,
          secretKey: secretFromRebalance,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFromRebalance, secretFromRebalance]);

  useEffect(() => {
    new Emitter().emitAll('onPriceProviderChange', priceProvider);

    if (
      getSelectedPriceProvider() === 'Binance' &&
      (!priceProvider.Binance.secretKey || !priceProvider.Binance.apiKey || !priceProvider.Binance.interval)
    ) {
      setIsValid(false);
      return;
    }

    if (
      getSelectedPriceProvider() &&
      (!priceProvider[getSelectedPriceProvider()].apiKey || !priceProvider[getSelectedPriceProvider()].interval)
    ) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceProvider]);

  useGetStateFromCP(isButlerStarted, getState, { PRICE_PROVIDER: priceProvider });

  const handleProviderOnChange = event => {
    event.persist();

    const {
      target: { value },
    } = event;

    setPriceProvider({
      [value]: {
        apiKey: value === 'Binance' ? apiFromRebalance : '',
        secretKey: value === 'Binance' ? secretFromRebalance : '',
        interval: 30,
      },
    });
  };

  const handleInputOnChange = event => {
    event.persist();

    const {
      target: { name, value },
    } = event;

    const [priceProviderName, prop] = name.split(' - ');

    setPriceProvider({
      [priceProviderName]: {
        ...priceProvider[priceProviderName],
        [prop]: value,
      },
    });
  };

  const handleIntervalOnChange = interval => {
    setPriceProvider({
      [getSelectedPriceProvider()]: {
        ...priceProvider[getSelectedPriceProvider()],
        interval,
      },
    });

    setIsIntervalOpen(false);
  };

  const selectedProvider = getSelectedPriceProvider();

  return (
    <div className='price-provider'>
      <div className='title-and-provider-wrapper'>
        <QuestionTitle isValid={isValid} title='Price Provider' />
        <div className='price-provider-wrapper'>
          {PRICE_PROVIERS.map((provider, idx) => {
            return (
              <div className='current-provider' key={provider}>
                <Input
                  id={provider}
                  value={provider}
                  type='radio'
                  onChange={handleProviderOnChange}
                  checked={selectedProvider === provider}
                />
                <label htmlFor={provider}>{provider}</label>
                <div className={`check`} />
              </div>
            );
          })}
        </div>
      </div>
      <div className='price-provider-inputs-wrapper'>
        {selectedProvider && (
          <div className='price-provider-input-wrapper'>
            <Input
              type='text'
              value={priceProvider[selectedProvider].apiKey}
              onChange={handleInputOnChange}
              name={selectedProvider + ' - ' + 'apiKey'}
              placeholder='API KEY'
              className='price-provider-api'
            />
          </div>
        )}
        {selectedProvider === 'Binance' && (
          <div className='price-provider-input-wrapper'>
            <Input
              type='text'
              value={priceProvider[selectedProvider].secretKey}
              onChange={handleInputOnChange}
              name={selectedProvider + ' - ' + 'secretKey'}
              placeholder='SECRET KEY'
              className='price-provider-secret'
            />
          </div>
        )}
        {selectedProvider && (
          <div className='price-provider-input-wrapper'>
            <p>Price interval update</p>
            <p
              className={`selected-interval ${isIntervalOpen ? 'menu-open' : null}`}
              onClick={() => setIsIntervalOpen(isIntervalOpen => !isIntervalOpen)}
            >
              {priceProvider[selectedProvider].interval}
            </p>
          </div>
        )}
      </div>
      <div className='generate-url'>
        <button
          onClick={() => {
            const { shell } = window.require('electron');
            shell.openExternal(GENERATE_KEY_URL[selectedProvider]);
          }}
        >
          {`Generate key for ${selectedProvider}`}
        </button>
      </div>
      <div>
        {isIntervalOpen && (
          <div className='interval-menu'>
            {Object.keys(PRICE_PROVIDER_INTERVALS).map(interval => (
              <div
                onClick={() => handleIntervalOnChange(interval)}
                name={interval}
                key={interval}
                className='interval-wrapper'
              >
                <p>{interval}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceProvider;
