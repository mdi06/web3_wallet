import ethereum_address from 'ethereum-address';
import AbstractCurrencyValidator from './AbstractCurrencyValidator';

class EthValidator extends AbstractCurrencyValidator{
    validateAddress(address){
        if(!ethereum_address.isAddress(address)){
            throw new Error('Invalid Ethereum Address');
        }
    };
}

export default EthValidator;