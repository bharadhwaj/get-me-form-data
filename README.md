# get-me-form-data

Tiny function to get the form data and validate it.

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
