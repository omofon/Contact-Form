import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://hknttckvivloiebbeees.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbnR0Y2t2aXZsb2llYmJlZWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NT";

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
  // ----- ELEMENT SELECTORS -----
  const form = document.getElementById("contact-form");

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

  const submitButton = form.querySelector("button[type='submit']");
  const successPopup = document.getElementById("success-popup");

  // ----- ERROR MESSAGES -----
  const errorDict = {
    firstName: { empty: "This field is required" },
    lastName: { empty: "This field is required" },
    email: {
      empty: "This field is required",
      invalid: "Please enter a valid email address",
    },
    queryType: { empty: "Please select a query type" },
    message: { empty: "This field is required" },
    consent: {
      empty: "To submit this form, please consent to being contacted",
    },
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ----- ACCESSIBLE ERROR HELPERS -----
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

  // ----- VALIDATION -----
  function validateRequiredText(inputEl, errorEl, msg) {
    const value = inputEl.value.trim();
    if (value === "") {
      setError(inputEl, errorEl, msg);
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
    const checked = document.querySelector('input[name="query-type"]:checked');
    if (!checked) {
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

  // -----------------------------------------------------------------
  // 🔔 SUCCESS POPUP
  // -----------------------------------------------------------------
  function showSuccessPopup() {
    successPopup.classList.remove("hidden");
    successPopup.classList.add("show");
    successPopup.focus();

    setTimeout(() => {
      successPopup.classList.remove("show");
      setTimeout(() => successPopup.classList.add("hidden"), 300);
    }, 4000);
  }

  // -----------------------------------------------------------------
  // ⏳ BUTTON LOADING STATE
  // -----------------------------------------------------------------
  function startLoading() {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  function stopLoading() {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }

  // -----------------------------------------------------------------
  // 📤 SUBMIT HANDLER WITH SUPABASE
  // -----------------------------------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate form
    const isValid =
      validateRequiredText(
        firstNameInput,
        firstNameError,
        errorDict.firstName.empty
      ) &&
      validateRequiredText(
        lastNameInput,
        lastNameError,
        errorDict.lastName.empty
      ) &&
      validateEmail() &&
      validateQueryRadio() &&
      validateRequiredText(
        messageInput,
        messageError,
        errorDict.message.empty
      ) &&
      validateConsent();

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        if (firstInvalid.tagName === "FIELDSET") {
          firstInvalid.querySelector("input").focus();
        } else {
          firstInvalid.focus();
        }
      }
      return;
    }

    // ------------------------------
    // Start loading
    // ------------------------------
    startLoading();

    // Build data object
    const formData = {
      first_name: firstNameInput.value.trim(),
      last_name: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      query_type: document.querySelector('input[name="query-type"]:checked')
        .value,
      message: messageInput.value.trim(),
      consent: consentCheckbox.checked,
    };

    // Send to Supabase
    const { error } = await supabase
      .from("contact_messages")
      .insert([formData]);

    if (error) {
      console.error("Supabase error:", error);
      stopLoading();
      alert("Something went wrong. Try again.");
      return;
    }

    // ------------------------------
    // Success
    // ------------------------------
    stopLoading();
    form.reset();
    showSuccessPopup();
  });

  // ----- REAL-TIME VALIDATION -----
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

  document
    .querySelectorAll('input[name="query-type"]')
    .forEach((radio) => radio.addEventListener("change", validateQueryRadio));
});
