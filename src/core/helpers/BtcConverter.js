import Converter from './converter';


const DECIMALS=8;
class BtcConverter extends Converter{
    toDecimals(amount) {
        return super.toDecimals(amount, DECIMALS);
    }

    fromDecimals(amount) {
        return super.fromDecimals(amount, DECIMALS);
    }
}

export default BtcConverter;