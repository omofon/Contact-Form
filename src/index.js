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

  const queryFieldset = document.querySelector(
    'fieldset[aria-describedby="query-error"]'
  );
  const queryError = document.getElementById("query-error");

  const messageInput = document.getElementById("message");
  const messageError = document.getElementById("message-error");

  const consentCheckbox = document.getElementById("consent");
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
  function setError(element, errorEl, message) {
    if (element.tagName === "FIELDSET") {
      element.setAttribute("aria-invalid", "true");
    } else {
      element.classList.add("invalid");
      element.setAttribute("aria-invalid", "true");
    }
    errorEl.textContent = message;
    errorEl.classList.add("active");
  }

  function clearError(element, errorEl) {
    if (element.tagName === "FIELDSET") {
      element.removeAttribute("aria-invalid");
    } else {
      element.classList.remove("invalid");
      element.removeAttribute("aria-invalid");
    }
    errorEl.textContent = "";
    errorEl.classList.remove("active");
  }

  function validateRequiredText(inputEl, errorEl, errorMessage) {
    const value = inputEl.value.trim();
    if (value === "") {
      setError(inputEl, errorEl, errorMessage);
      return false;
    }
    clearError(inputEl, errorEl);
    return true;
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    if (email === "") {
      setError(emailInput, emailError, errorDict.email.empty);
      return false;
    }
    if (!emailRegex.test(email)) {
      setError(emailInput, emailError, errorDict.email.invalid);
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validateQueryRadio() {
    const queryTypeChecked = document.querySelector(
      'input[name="query-type"]:checked'
    );
    if (!queryTypeChecked) {
      setError(queryFieldset, queryError, errorDict.queryType.empty);
      return false;
    }
    clearError(queryFieldset, queryError);
    return true;
  }

  function validateConsent() {
    if (!consentCheckbox.checked) {
      setError(consentCheckbox, consentError, errorDict.consent.empty);
      return false;
    }
    clearError(consentCheckbox, consentError);
    return true;
  }

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all fields
    const isFirstNameValid = validateRequiredText(
      firstNameInput,
      firstNameError,
      errorDict.firstName.empty
    );
    const isLastNameValid = validateRequiredText(
      lastNameInput,
      lastNameError,
      errorDict.lastName.empty
    );
    const isEmailValid = validateEmail();
    const isQueryValid = validateQueryRadio();
    const isMessageValid = validateRequiredText(
      messageInput,
      messageError,
      errorDict.message.empty
    );
    const isConsentValid = validateConsent();

    // Check if all validations passed
    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isQueryValid &&
      isMessageValid &&
      isConsentValid
    ) {
      console.log("Form is valid!");
      // form.submit();
    } else {
      const firstInvalidField = form.querySelector('[aria-invalid="true"]');
      if (firstInvalidField) {
        if (firstInvalidField.tagName === "FIELDSET") {
          firstInvalidField.querySelector("input").focus();
        } else {
          firstInvalidField.focus();
        }
      }
    }
  });

  // Real-time validation on blur
  firstNameInput.addEventListener("blur", () =>
    validateRequiredText(
      firstNameInput,
      firstNameError,
      errorDict.firstName.empty
    )
  );
  lastNameInput.addEventListener("blur", () =>
    validateRequiredText(lastNameInput, lastNameError, errorDict.lastName.empty)
  );
  emailInput.addEventListener("blur", validateEmail);
  messageInput.addEventListener("blur", () =>
    validateRequiredText(messageInput, messageError, errorDict.message.empty)
  );
  consentCheckbox.addEventListener("change", validateConsent);

  // Validate radio buttons on change
  document.querySelectorAll('input[name="query-type"]').forEach((radio) => {
    radio.addEventListener("change", validateQueryRadio);
  });
});
