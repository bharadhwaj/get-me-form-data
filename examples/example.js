import React from "react";
import ReactDOM from "react-dom";
import getMeFormData from "getmeformdata";

import "./styles.css";

const formSpec = {
  name: {
    validator: 'required'
  },
  remember_me: {
    type: 'boolean'
  }
};

function handleOnSubmit(e) {
  e.preventDefault();
  const data = getMeFormData(e.target, formSpec);

  console.log(data);
}

function App() {
  return (
    <div className="App">
      <form onSubmit={handleOnSubmit}>
        <label>Name</label>
        <input name="name" />

        <label>Email</label>
        <input name="email" />

        <label>Remember me?</label>
        <input name="email" type='checkbox'/>

        <button>Submit</button>
      </form>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
