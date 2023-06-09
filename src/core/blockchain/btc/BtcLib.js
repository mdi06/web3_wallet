import AbstractCurrencyLib from "../AbstractCurrencyLib";
import BtcValidator from "../../validators/blockchain/BtcValidator";
import BtcConverter from "../../helpers/BtcConverter";
import BlockcypherProvider from "../btc/BlockCypherProvider";
const {ECPair,TransactionBuilder,networks} = require('bitcoinjs-lib');

const BTCNETWORK = networks.testnet;
const BTC_ADDRESS = process.env.BTC_ADDRESS;
const BTC_WIF = process.env.BTC_WIF;



class BtcLib extends AbstractCurrencyLib {
    constructor(app) {
        let validator = new BtcValidator();
        let converter = new BtcConverter();
        let provider = new BlockcypherProvider(app, validator, converter);
        
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

    sendCurrency(to,amount){
        return new Promise(async(resolve,reject)=>{
            try{
                console.log("btcLib sendCurrency start")
                let txParams = await this._formatTransactionParameters(to,amount)
                console.log("btcLib sendCurrency formatTxParams",txParams)
                let rawTx = await this._createSignRawTx(txParams);
                console.log("btcLib sendCurrency rawTx",rawTx)
                let txHash = await this.provider.sendTx(rawTx);
                console.log("btcLib sendCurrency sendTx",txHash)
                return resolve(txHash);
            }catch (e) {
                return reject(e)
            }
        })
    }

    _createSignRawTx(txParams){
        return new Promise(async(resolve,reject)=>{
            try {
                console.log("btc lib createSignRawTx");
                
                let keyring = await ECPair.fromWIF(BTC_WIF,BTCNETWORK);
                console.log("keyring",keyring);
                console.log("btcLib txb")
                let txb = new TransactionBuilder(BTCNETWORK);
                console.log("btcLib addSignedUtxos");
                txb = await this.provider.addSignedUtxos(keyring,txb,txParams["from"],txParams["to"],txParams["amount"],txParams["fee"]);
                console.log("btcLib txb")
                let txHash = txb.build().toHex();
                this.validator.validateString(txHash,'txHash');
                console.log('_createSignRawTx end txHash ',txHash);
                return resolve(txHash)
            }catch (e){
                return reject(e);
            }
        })
    }

    _formatTransactionParameters(to,amount){
        return new Promise(async(resolve,reject)=>{
            try{
                let from = await this.getAddress();
                let fee = await this.getFee();
                console.log('formatTxParams fee',fee)
                amount = parseFloat(amount);
                console.log('formatTxParams amount',amount)
                this.validator.validateAddress(to);
                this.validator.validateNumber(amount);
                this.validator.validateNumber(fee);
                console.log('formatTxParams validate over')
                amount = this.fromDecimals(amount);
                fee = this.fromDecimals(fee);
                console.log('formatTxParams afterDecimals',fee)
                amount = Math.round(amount);
                fee = Math.round(fee);
                console.log('formatTxParams before txParams',amount)
                let txParams={
                    from:from,
                    to:to,
                    amount:amount,
                    fee:fee
                }
                console.log('formatTxParams txDParams',txParams)
                return resolve(txParams);
            }catch (e){
                return reject(e);
            }
        })
    }

    getFee(){
        return new Promise(async(resolve,reject)=>{
            try{
                let fee = await this.provider.getFee()
                console.log("btcLib getFee",fee);
                return resolve(fee);
            }catch(e){
                return reject(e)
            }
        })
    }

}

export default BtcLib;