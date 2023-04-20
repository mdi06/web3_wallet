import EthLib from "./eth/EthLib";
import Erc20Lib from "./erc20/Erc20Lib";
import BtcLib from "../blockchain/btc/BtcLib";


class BlockchainService {

    constructor(app) {
        this.app = app;
        let eth = new EthLib();
        let erc20 = new Erc20Lib();
        let btc = new BtcLib();
        this.libraries ={
          "ETH": eth,
          "ERC20": erc20,
          "BTC": btc

        };
    }


    getCurrentLibrary() {
      return this.libraries[this.app.getCurrency()];
    }

      getCurrentBalance(){
        return new Promise(async(resolve,reject)=>{
            try{
                let balance = await this.getCurrentLibrary().getCurrentBalance();
                return resolve(balance);
            }catch (e) {
                return reject(e);
            }
        })
    }

      getAddress() {
        return new Promise(async (resolve, reject) => {
          try {
            let balance = await this.getCurrentLibrary().getAddress();
            return resolve(balance);
          } catch (e) {
            return reject(e);
          }
        });
      }

      sendCurrency(to, amount) {
        return new Promise(async (resolve, reject) => {
          try {
            let result = await this.getCurrentLibrary().sendCurrency(to, amount);
            return resolve(result);
          } catch (e) {
            return reject(e);
          }
        });
      }
      
}

export default BlockchainService;