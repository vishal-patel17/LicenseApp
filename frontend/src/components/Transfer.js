import React from "react";

export function Transfer({ transferTokens, tokenSymbol }) {
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const address = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";
          transferTokens(address);
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
            defaultValue="John Doe"
          />
        </div>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
            defaultValue="JohnDoe@abc.com"
          />
        </div>
        <div className="form-group">
          <label>Card Details</label>
          <input
            type="card"
            className="form-control"
            id="card"
            defaultValue="1111-2222-3333-4444"
          />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Purchase" />
        </div>
      </form>
    </div>
  );
}
