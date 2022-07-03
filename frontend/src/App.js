import './App.css';

function App() {
  return (
    <div class="mainscreen">
      <div class="card">
        <div class="leftside">
          <img src="https://img.cpapracticeadvisor.com/files/base/cygnus/cpa/image/2019/05/Thomson_Reuters_Logo.5ce4592a437ab.png?auto=format%2Ccompress&w=320"
            class="product" alt="UltraTax" />
        </div>
        <div class="rightside">
          <form action="">
            <h1>UltraTax CS Express 100</h1>
            <h2>$2650/year*</h2>
            <h3>Payment Information</h3>
            <p>Cardholder Name</p>
            <input type="text" class="inputbox" name="name" value="John Doe" required />
            <p>Card Number</p>
            <input type="number" class="inputbox" name="card_number" id="card_number" value="1111222233334444"
              required />

            <p>Card Type</p>
            <select class="inputbox" name="card_type" id="card_type" required>
              <option value="">--Select a Card Type--</option>
              <option value="Visa">Visa</option>
              <option value="RuPay">RuPay</option>
              <option value="MasterCard">MasterCard</option>
            </select>
            <div class="expcvv">

              <p class="expcvv_text">Expiry</p>
              <input type="date" class="inputbox" name="exp_date" id="exp_date" required />

              <p class="expcvv_text2">CVV</p>
              <input type="password" class="inputbox" name="cvv" id="cvv" value="123" required />
            </div>
            <p></p>
            <button type="submit" class="button">Pay now</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
