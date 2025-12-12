document.addEventListener("DOMContentLoaded", () => {
  //   Form Selector
  const form = document.getElementById("contact-form");

  // Selectors for input fields and error spans
  const firstNameInput = document.getElementById("first-name");
  const firstNameError = document.getElementById("first-name-error");

  const lastNameInput = document.getElementById("last-name");
  const lastNameError = document.getElementById("last-name-error");

  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");

  const queryRadios = document.querySelectorAll(".query-radio");
  const queryError = document.getElementById("query-error");

  const consentChecked = document.getElementById("consent");
  const consentError = document.getElementById("consent-error");

  // Error object
  const errorDict = {
    firstName: {
      empty: "This field is required",
    },
    lastName: {
      empty: "This field is required",
    },
    email: {
      empty: "This field is required",
      invalid: "Please enter a valid email address",
    },
    queryType: {
      empty: "Please select a query type",
    },
    message: {
      empty: "This field is required",
    },
    consent: {
      empty: "To submit this form, please consent to being contacted",
    },
  };

  //   Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   --- Helper Functions --- //
  function setError(inputEl, errorEl, message) {
    inputEl.classList.add("invalid");
    errorEl.textContent = message;
  }

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove("invalid");
    errorEl.textContent = "";
  }

  function validateRequiredText(inputEl, errorEl) {
    const value = inputEl.value.trim();
    if (value === "") {
      setError(inputEl, errorEl, "This field is required");
      return false;
    }
    clearError(inputEl, errorEl);
    return true;
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    if (email === "") {
      setError(emailInput, emailError, "This field is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError(emailInput, emailError, "Please enter a valid email address");
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validateQueryRadio(){
    
  }
});
