
let startTimer = 0;
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const form = document.getElementById("newsletter-form");

const onSubscribeClick = (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const emailValue = emailInput.value;
  const errorMsg = document.getElementById("error-message");
  const successMsg = document.getElementById("success-message");
  successMsg.style.display = "none";

  if (!emailValue) {
    errorMsg.innerText = "Email address is required";
  } else if (!emailValue.match(emailRegex)) {
    errorMsg.innerText = "Please enter a valid email";  
  } else {
    errorMsg.innerText = ""
    successMsg.style.display = "block";
    startTimer = setTimeout(() => successMsg.style.display = "none", 30000);
  }
};

form.addEventListener("submit", onSubscribeClick)