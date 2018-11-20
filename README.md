# get-me-form-data

[![Build Status](https://travis-ci.org/Anenth/get-me-form-data.svg?branch=master)](https://travis-ci.org/Anenth/get-me-form-data)
[![npm version](https://badge.fury.io/js/getmeformdata.svg)](https://badge.fury.io/js/getmeformdata)

Tiny function to get the form data and validate it.
https://codesandbox.io/s/vmv90nno45

### Install

```javascript
npm install getmeformdate --save
```

#### Usage

```javascript
const formSpec = {
    name: {
        validator: 'required'
    }
};

function handleOnSubmit(e) {
  e.preventDefault();
  const data = getMeFormData(e.target, formSpec);

  console.log(data); /*eg. {
      data:{
        name: "",
        email: ""
      },
      error: {
          name: "This is required"
      }
    }*/
}

<form onSubmit={handleOnSubmit}>
    <input name="name" />
    <input name="email"/>
    <button>Submit</button>
</form>
}
```
