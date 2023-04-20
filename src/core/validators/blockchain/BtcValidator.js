import WalletAddressValidator from 'wallet-address-validator';
import AbstractCurrencyValidator from './AbstractCurrencyValidator';

const BTC = "BTC";

class BtcValidator extends AbstractCurrencyValidator{
    validateAddress(address){
        this.validateString(address,"BTC Address");
        WalletAddressValidator.validate(address,BTC);
    };
}


export default BtcValidator;