document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Inject selected experience name (from main site flow) ---------- */
  const activity =
    localStorage.getItem("activityName") || "Palm Jumeirah Experience";
  const heroName = document.getElementById("hero-activity");
  const reachName = document.getElementById("reach-activity");
  const mapTitle = document.getElementById("map-activity-title");

  if (heroName) heroName.textContent = activity;
  if (reachName) reachName.textContent = activity;
  if (mapTitle) mapTitle.textContent = activity;

  /* ---------- Elements ---------- */
  const dpTrigger = document.getElementById("dp-trigger");
  const dpTriggerText = document.getElementById("dp-trigger-text");
  const dpModal = document.getElementById("dp-modal");
  const dpClose = document.getElementById("dp-close");
  const dpCancel = document.getElementById("dp-cancel");
  const dpPrev = document.getElementById("dp-prev");
  const dpNext = document.getElementById("dp-next");
  const dpMonthLabel = document.getElementById("dp-month-label");
  const dpGrid = document.getElementById("dp-grid");

  const tpTrigger = document.getElementById("tp-trigger");
  const tpTriggerText = document.getElementById("tp-trigger-text");
  const tpModal = document.getElementById("tp-modal");
  const tpClose = document.getElementById("tp-close");
  const tpCancel = document.getElementById("tp-cancel");
  const tpGrid = document.getElementById("tp-grid");

  const timeBlock = document.getElementById("time-block");
  const confirmBtn = document.getElementById("confirm");
  const errorBox = document.getElementById("form-error");

  /* ---------- Date constraints ---------- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = null;
  let selectedTime = null;

  const setStartOfDay = (d) => d.setHours(0, 0, 0, 0);
  const formatButtonDate = (date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }); // 24h locale later
  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const showError = (msg) => {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  };
  const hideError = () => (errorBox.style.display = "none");

  /* ---------- DATE PICKER ---------- */
  function updateArrows() {
    const isAtMin =
      viewDate.getFullYear() === minMonth.getFullYear() &&
      viewDate.getMonth() === minMonth.getMonth();
    dpPrev.disabled = isAtMin;
  }

  function renderCalendar() {
    dpGrid.innerHTML = "";
    dpMonthLabel.textContent = viewDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    updateArrows();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const firstDay = (first.getDay() + 6) % 7; // Monday first
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // leading blanks
    for (let i = 0; i < firstDay; i++)
      dpGrid.appendChild(document.createElement("div"));

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "dp-cell";
      cell.textContent = day;

      const cellDate = new Date(year, month, day);
      setStartOfDay(cellDate);

      if (cellDate < today) {
        cell.classList.add("disabled");
      } else {
        cell.addEventListener("click", () => {
          document
            .querySelectorAll(".dp-cell.selected")
            .forEach((c) => c.classList.remove("selected"));
          cell.classList.add("selected");
          selectedDate = cellDate;
          dpTriggerText.textContent = formatButtonDate(cellDate);

          // close date modal & reveal time
          dpModal.style.display = "none";
          timeBlock.classList.remove("hidden");
          timeBlock.classList.add("visible");
        });
      }
      dpGrid.appendChild(cell);
    }
  }

  function openDp() {
    // ensure time modal closed
    tpModal.style.display = "none";
    dpModal.style.display = "flex";
    renderCalendar();
  }
  function closeDp() {
    dpModal.style.display = "none";
  }

  dpTrigger.addEventListener("click", openDp);
  dpClose.addEventListener("click", closeDp);
  if (dpCancel) dpCancel.addEventListener("click", closeDp);
  dpPrev.addEventListener("click", () => {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    if (prev >= minMonth) viewDate = prev;
    renderCalendar();
  });
  dpNext.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  /* ---------- TIME PICKER (24h slots) ---------- */
  function renderTimeSlots() {
    tpGrid.innerHTML = "";

    const startHour = 5; // 05:00
    const endHour = 22; // up to 21:30
    const now = new Date();

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 30]) {
        if (hour === endHour && minute === 30) break;

        const cell = document.createElement("div");
        cell.className = "dp-cell";
        const timeStr = formatTime(hour, minute);
        cell.textContent = timeStr;

        if (selectedDate) {
          const slot = new Date(selectedDate);
          slot.setHours(hour, minute, 0, 0);

          // disable past times for today
          if (
            selectedDate.toDateString() === new Date().toDateString() &&
            slot <= now
          ) {
            cell.classList.add("disabled");
          }
        }

        cell.addEventListener("click", () => {
          if (cell.classList.contains("disabled")) return;
          document
            .querySelectorAll("#tp-grid .dp-cell.selected")
            .forEach((c) => c.classList.remove("selected"));
          cell.classList.add("selected");
          selectedTime = timeStr;
          tpTriggerText.textContent = timeStr;
          tpModal.style.display = "none";
        });

        tpGrid.appendChild(cell);
      }
    }
  }

  function openTp() {
    if (!selectedDate) {
      showError("Please select a date first.");
      return;
    }
    hideError();
    // ensure date modal closed
    dpModal.style.display = "none";
    tpModal.style.display = "flex";
    renderTimeSlots();
  }
  function closeTp() {
    tpModal.style.display = "none";
  }

  tpTrigger.addEventListener("click", openTp);
  tpClose.addEventListener("click", closeTp);
  if (tpCancel) tpCancel.addEventListener("click", closeTp);

  /* ---------- CONFIRM ---------- */
  confirmBtn.addEventListener("click", () => {
    hideError();
    if (!selectedDate) {
      showError("Please select a date.");
      return;
    }
    if (!selectedTime) {
      showError("Please select a time slot.");
      return;
    }

    // persist for /card page & rest of the flow (same storage pattern as main site) :contentReference[oaicite:5]{index=5}
    localStorage.setItem("selectedDate", selectedDate.toISOString());
    localStorage.setItem("selectedTime", selectedTime);

    // (Optional) keep existing localStorage keys: activityName / price already stored upstream
    // Redirect to card page (matches app routes) :contentReference[oaicite:6]{index=6}
    window.location.href = "/card";
  });
});
