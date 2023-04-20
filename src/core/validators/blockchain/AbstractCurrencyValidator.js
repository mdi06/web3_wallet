//const Validator = require('../Validator');
import Validator from "../Validator";

class AbstractCurrencyValidator extends Validator{
    validateAddress(address){
        throw new Error("validateAddress not implemented");
    }
}

export default AbstractCurrencyValidator;
