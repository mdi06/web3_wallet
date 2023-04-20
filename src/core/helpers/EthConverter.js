import Converter from "./converter";

const DECIMALS = 12;

class EthConverter extends Converter {
    toDecimals(amount) {
        return super.toDecimals(amount, DECIMALS);
      }

      fromDecimals(amount) {
        return super.fromDecimals(amount, DECIMALS);
      }
}

export default EthConverter;
