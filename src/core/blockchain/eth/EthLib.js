let address = process.env.ETH_ADDRESS;
let privateKey = process.env.ETH_PRIVATEKEY;
const PROVIDER_URL = process.env.ETH_PROVIDERURL;

let GWEI = 10**9;
let GAS_PRICE = 70* GWEI;
let GAS_LIMIT = 21000;

const Web3 = require("web3");
import Transaction from 'ethereumjs-tx';
import EthConverter from '../../helpers/EthConverter';
import Validator from '../../validators/blockchain/EthValidator';

import AbstractCurrencyLib from '../AbstractCurrencyLib';


class EthLib extends AbstractCurrencyLib {
    constructor() {
        let web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
        //this.web3 = new Web3(new Web3.providers.HttpProvider(providerURL));
        let converter = new EthConverter();
        let validator = new Validator();
        super(web3,validator,converter);
    }


    getAddress() {
        return new Promise(async (resolve, reject) => {
          try {
            return resolve(address);
          } catch (e) {
            return reject(e);
          }
        });
      }

      getPrivateKey() {
        return new Promise(async (resolve, reject) => {
          try {
            return resolve(privateKey);
          } catch (e) {
            return reject(e);
          }
        });
      }

    getBalance(address) {
        return new Promise(async (resolve, reject) => {
          try {
            let balance = await this.provider.eth.getBalance(address);
            balance = this.provider.utils.fromWei(balance);
            return resolve(balance);
          } catch (e) {
            return reject(e);
          }
        });
      }

      getCurrentBalance() {
        return new Promise(async (resolve, reject) => {
          try {
            let address = await this.getAddress();
            let balance = await this.getBalance(address);
            return resolve(balance);
          } catch (e) {
            return reject(e);
          }
        });
      }
      
      sendCurrency(to, amount) {
        return new Promise(async(resolve,reject)=> {
          try {
            this.validator.validateAddress(to,"Tx Receiver");
            this.validator.validatorNumber(amount, "sendCurrency Amount");
            let txData = await this._formatTransactionParams(to, amount);
            let hash = await this._makeTransaction(txData);
            return resolve(hash);
          }catch (e) {
            return reject(e);
          }
        })
      }

      _formatTransactionParams(to, value, data){
        return new Promise(async(resolve,reject)=> {
          try {
            this.validator.validateAddress(to);
            this.validator.validateNumber(value);
            this.validator.validateString(data);

            let privateKey = await this.getPrivateKey();
            let privKeyBuffer=Buffer.from(privateKey,'hex');
            let from = await this.getAddress();
            let nonce = await this.getNextNonce();

            this.validator.validateAddress(from);
            this.validator.validateNumber(nonce);

            let gasPrice = this.getGasPrice();
            let gasLimit = this.getGasLimit();
            value = this.fromDecimals(value);
            let txParams = {
              "from":from,
              "to":to,
              "privateKey":privKeyBuffer,
              "value":this.provider.utils.numberToHex(value),
              "gasPrice":this.provider.utils.numberToHex(gasPrice),
              "gasLimit":gasLimit,
              "nonce":nonce,
              "data":data,
          };
          return resolve(txParams);
          }catch (e) {
            return reject(e)
          }
        })
      }

      toDecimals(amount) {
        return this.converter.toDecimals(amount);
      }

      fromDecimals(amount) {
        return this.converter.fromDecimals(amount);
      }

      getGasPrice() {
        return GAS_PRICE;
      }

      getGasLimit() {
        return GAS_LIMIT;
      }

      getNextNonce(){
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.getAddress();
                let nonce =await this.provider.eth.getTransactionCount(address);
                return resolve(nonce);
            }catch (e){
                return reject(e)
            }
        });
    }

      _makeTransaction(txParams){
        return new Promise(async (resolve,reject)=>{
            try{
                let tx = new Transaction(txParams);
                console.log(tx);
                tx.sign(txParams.privateKey);
                var raw = "0x"+tx.serialize().toString('hex');

                this.provider.eth.sendSignedTransaction(raw).on("receipt",(data)=>{
                    console.log(data);
                    let transactionHash = data["transactionHash"];
                    return resolve(transactionHash);
                }).on("error",(e)=>{
                    console.error(e);
                    return reject(e);
                });

            }catch(e){
                return reject(e);
            }
        });
    }
}


//module.exports = EthLib;
export default EthLib;
