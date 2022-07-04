import React from "react";

export function Transfer({ transferTokens, tokenSymbol }) {
  return (
    <div>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          const address = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";
          // const to = formData.get("to");
          // const amount = formData.get("amount");
          transferTokens(address);
          // if (to && amount) {
          //   // Give License
          //   transferTokens(to, amount);
          // }
        }}
      >
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            type="string"
            step="1"
            name="name"
            placeholder="Name"

          />
        </div>
        <div className="form-group">
          <label>Email address</label>
          <input type="email" className="form-control" id="email" placeholder="name@example.com" />
        </div>
        <div className="form-group">
          <label>Card Details</label>
          <input type="card" className="form-control" id="card" placeholder="1111-2222-3333-4444" />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Purchase" />
        </div>
      </form>
    </div>
  );
}
