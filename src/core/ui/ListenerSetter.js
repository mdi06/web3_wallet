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
      console.log('change currency');
    }


  }

module.exports = ListenerSetter;