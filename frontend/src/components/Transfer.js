import React from "react";

export function Transfer({ transferTokens }) {
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const userAddr = formData.get("name");
          const address = userAddr;
          transferTokens(address);
        }}
      >
        <div className="heading">
          <h2>Generating License</h2>
        </div>
        <div className="form-group">
          <label>Public address </label>
          <input
            className="form-control"
            type="string"
            step="1"
            name="name"
            defaultValue="0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"
          />
        </div>
        <div className="form-group">
          <input
            className="btn btn-primary"
            type="submit"
            value="Generate License"
          />
        </div>
      </form>
    </div>
  );
}
