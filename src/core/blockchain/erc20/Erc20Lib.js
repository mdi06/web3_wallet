import EthLib from "../eth/EthLib";
import ERC20_ABI from "./erc20_abi";
import Converter from "../../helpers/Erc20Converter";

const contractAddress = process.env.ERC_20_CONTRACT_ADDRESS;
const GAS_LIMIT = 300000;
const DECIMALS = 12;


class Erc20Lib extends EthLib {

    constructor() {
        super();
        this.setContract();
        this.converter = new Converter();
    }

    composeContract() {
        console.log("ComposeCotract start", ERC20_ABI)
        let contract = new this.provider.eth.Contract(ERC20_ABI, this.getContractAddress());
        console.log("composeContract end", ERC20_ABI);
        return contract;
    }

    setContract() {
        this.contract = this.composeContract();
    }

    getContractAddress() {
        return contractAddress;
    }

    getContract() {
        return this.contract;
    }

    getCurrentBalance() {
        return new Promise(async (resolve, reject) => {
            try {
              let address = await this.getAddress();
              let balance = await this.getBalance(address);
              //balance = this.web3.utils.fromWei(balance);
              return resolve(balance);
            } catch (e) {
              return reject(e);
            }
          });
    }

    getBalance(address) {
        return new Promise(async (resolve, reject) => {
          try {
            let balance = await this.getContract().methods.balanceOf(address).call()
            console.log('erc20 raw balance', balance);
            balance = this.toDecimals(balance);
            console.log('erc20 after balance', balance);
            return resolve(balance);
          } catch (e) {
            return reject(e);
          }
        });
      }

      getGasLimit() {
        return GAS_LIMIT;
      }

      sendCurrency(to, amount) {
        return new Promise(async(resolve,reject)=> {
          try {
            amount = this.fromDecimals(amount);
            let data = this.getContract().methods.transfer(to, amount).encodeABI();
            console.log('sendCurrency data', data);
            let txData = await this._formatTransactionParams(this.getContractAddress(), "0", data);
            let hash = await this._makeTransaction(txData);
            return resolve(hash);
          }catch (e) {
            return reject(e);
          }
        })
      }

      toDecimals(amount) {
        return this.converter.toDecimals(amount, this.getDecimals());
      }

      fromDecimals(amount) {
        return this.converter.fromDecimals(amount, this.getDecimals());
        //return this.web3.utils.toWei(amount.toString(), 'ether');
      }

      getDecimals() {
        return DECIMALS;
      }


}




//module.exports = Erc20Lib;
export default Erc20Lib;