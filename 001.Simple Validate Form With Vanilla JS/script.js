const form = document.getElementById("signup_form");
const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password_confirmation");
const submitState = document.getElementById("form-submit");

const inputValue = [...document.querySelectorAll("input")];

const isMatching = (password, confirm) => {
  return password === confirm;
};

const isPassword = (passwordInput) => {
  //   /^
  // (?=.*\d)          // should contain at least one digit
  //   (?=.*[a-z])       // should contain at least one lower case
  //   (?=.*[A-Z])       // should contain at least one upper case
  //   [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
  // $/

  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(passwordInput);
};


const isEmpty = (input) => {
  return input === "" ? true : false;
};


const isEmail = (email) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};


const setError = (input, message) => {
  const inputParent = input.parentElement;
  const errorMessage = inputParent.querySelector("span");

  errorMessage.innerText = message;
  inputParent.classList.add("form_control-error");
  inputParent.classList.remove("form_control-success");
};


const setSuccess = (input) => {
  // the form control div
  const inputParent = input.parentElement;
  inputParent.classList.add("form_control-success");
  inputParent.classList.remove("form_control-error");
};



form.addEventListener(
  "focus",
  (e) => {
    const inputParent = e.target.parentElement;
    inputParent.classList.remove("form_control-error");
  },
  true
);


form.addEventListener(
  "blur",
  (e) => {
    if (isEmpty(e.target.value)) {
      setError(e.target, "This field cannot be blank");
    } else {
      switch (e.target.id) {
        case "fullname":
          setSuccess(e.target);
          break;
        case "email":
          isEmail(e.target.value)
            ? setSuccess(e.target)
            : setError(e.target, "invalid email format");
          break;

        case "password":
          isPassword(e.target.value)
            ? setSuccess(e.target)
            : setError(e.target, "Invalid password format");
          break;

        case "password_confirmation":
          isMatching(password.value, e.target.value)
            ? setSuccess(e.target)
            : setError(e.target, "Confirm password and password not match");
          isPassword(e.target.value)
            ? setSuccess(e.target)
            : setError(e.target, "Invalid password format");

          break;
      }
    }
  },
  true
);


form.addEventListener(
  "change",
  () => {
    inputValue.every((item) => item.value !== "")
      ? (submitState.disabled = false)
      : (submitState.disabled = true);
  },
  true
);
