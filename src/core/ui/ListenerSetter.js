class ListenerSetter {

  constructor(app) {
    this.app = app;
  }

  setEventListeners() {
    this.setSendListener();
    this.setChangeCurrencyListener();
  }

  setSendListener() {

    document.getElementById("send_button").addEventListener("click", (e) => {
      let to = document.getElementById('receiver').value;
      let amount = document.getElementById('amount').value;
        this.app.sendCurrency(to, amount).then((result)=> {
          alert(result);
        })
    })
      
    };

    setChangeCurrencyListener() {
      let elements = document.getElementsByClassName("currency-select");
      for(let element of elements){
        element.addEventListener("click", (event) => {
          let el = event.target;
          console.log(el);
          let currency = el.getAttribute('data-value'); 
          console.log('data-value=', currency);
          this.app.changeCurrency(currency);
          console.log(event);
        })
      }
      console.log('change currency');
    }


  }

module.exports = ListenerSetter;