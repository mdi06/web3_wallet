class Renderer{
  constructor(app) {
      this.app = app;
  }

  renderUi(){
      this.renderCurrency();
      this.renderBalance();
      this.renderAddress();
  }

  renderCurrency(){
      let elements = document.getElementsByClassName("crypto-name");
      for(let i=0; i<elements.length;i++){
          let element = elements[i];
          element.innerHTML = this.app.getCurrency();
      }
  }

  renderBalance(){
      let element = document.getElementById("crypto-balance");
      this.app.getCurrentBalance().then((balance)=>{
          element.innerHTML=balance;
      })
  }

  renderAddress(){
      let element = document.getElementsByClassName("address-value")[0];
      this.app.getAddress().then((address)=>{
          element.innerHTML = address;
      })
  }
}
module.exports = Renderer;