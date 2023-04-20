import AbstractCurrencyLib from "../AbstractCurrencyLib";
import BtcValidator from "../../validators/blockchain/BtcValidator";
import BtcConverter from "../../helpers/BtcConverter";
import BlockcypherProvider from "../btc/BlockCypherProvider";

const BTC_ADDRESS = process.env.BTC_ADDRESS;
console.log(process.env.BTC_ADDRESS);
const BTC_WIF = process.env.BTC_WIF;



class BtcLib extends AbstractCurrencyLib {
    constructor() {
        let validator = new BtcValidator();
        let converter = new BtcConverter();
        let provider = new BlockcypherProvider();
        super(provider,validator,converter);
    }

    getAddress(){
        return new Promise(async(resolve,reject)=>{
            try{
                return resolve(BTC_ADDRESS);
        }catch(e){
                return reject(e);
            }
        })
    };


    getBalance(address){
        return new Promise( async(resolve, reject) => {
            try {
                this.validator.validateAddress(address);
                let balance = await this.provider.getBalance(address);
                balance = this.converter.toDecimals(balance);
                return resolve(balance);
            }catch (e) {
                return reject(e);
            }
        })
    };

    getRequest(url, data, method, headers) {
        return new Promise ( async(resolve, reject) => {
            const options = {
                body: data,
                method: method,
                headers: headers
            };
            fetch(url, options).then((res) => {
                return resolve(res);
            }).catch(e => {
                return reject(e);
            });
    })
    };
}

export default BtcLib;