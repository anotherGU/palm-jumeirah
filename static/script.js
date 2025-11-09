function scrollToExperiences() {
  document.getElementById("experiences").scrollIntoView({
    behavior: "smooth",
  });
}

function scrollToBooking() {
  document.querySelector(".booking-section").scrollIntoView({
    behavior: "smooth",
  });
}

function updateCountdown() {
  const now = new Date();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const timeRemaining = endOfMonth - now;

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days
    .toString()
    .padStart(2, "0");
  document.getElementById("hours").textContent = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}

function filterOffers(category) {
  const offerCards = document.querySelectorAll(".offer-card");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const navFilters = document.querySelectorAll(".nav-filter");

  categoryButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  navFilters.forEach((nav) => {
    nav.classList.remove("active");
  });

  document
    .querySelector(`.category-btn[data-category="${category}"]`)
    .classList.add("active");
  document
    .querySelector(`.nav-filter[data-category="${category}"]`)
    .classList.add("active");

  offerCards.forEach((card) => {
    if (category === "all" || card.getAttribute("data-category") === category) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 50);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      const tabContent = document.getElementById(tabId);
      const parent = this.closest(".offer-content");

      parent.querySelectorAll(".tab-button").forEach((btn) => {
        btn.classList.remove("active");
      });

      parent.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      this.classList.add("active");
      tabContent.classList.add("active");
    });
  });

  const categoryButtons = document.querySelectorAll(".category-btn");
  const navFilters = document.querySelectorAll(".nav-filter");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      filterOffers(category);
    });
  });

  navFilters.forEach((nav) => {
    nav.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.getAttribute("data-category");
      filterOffers(category);
      scrollToExperiences();
    });
  });

  const bookButtons = document.querySelectorAll(".book-btn");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const experience = this.getAttribute("data-experience");
      document.getElementById("experience").value = experience;
      scrollToBooking();
    });
  });

  const bookingForm = document.getElementById("bookingForm");
  const modal = document.getElementById("bookingModal");
  const confirmBtn = document.getElementById("confirmBookingBtn");
  const editBtn = document.getElementById("editBookingBtn");

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const experience = document.getElementById("experience").value;

    const nameRegex = /^[A-Za-z\s'-]+$/;

    let isValid = true;

    document.getElementById("name").classList.remove("error");
    document.getElementById("phone").classList.remove("error");

    if (!nameRegex.test(fullName)) {
      document.getElementById("name").classList.add("error");
      isValid = false;
    }

    // ✅ Strict UAE phone validation: +971 + 9 digits
    const prefix = "+971";
    if (!phone.startsWith(prefix)) {
      document.getElementById("phone").classList.add("error");
      isValid = false;
    } else {
      const phoneDigits = phone.slice(prefix.length);
      const digitRegex = /^[0-9]+$/;

      if (!digitRegex.test(phoneDigits) || phoneDigits.length !== 9) {
        document.getElementById("phone").classList.add("error");
        isValid = false;
      }
    }

    const agreementChecked = document.getElementById("agreement").checked;
    const agreementBlock = document.querySelector(".form-check");

    if (!agreementChecked) {
      agreementBlock.classList.add("error");
      return;
    } else {
      agreementBlock.classList.remove("error");
    }

    if (!isValid) return;

    const price =
      document
        .querySelector(`.book-btn[data-experience="${experience}"]`)
        ?.closest(".offer-card")
        ?.querySelector(".current-price")
        ?.textContent?.replace("AED ", "") || "0";

    document.getElementById("modalExperience").textContent = experience;
    document.getElementById("modalName").textContent = fullName;
    document.getElementById("modalPhone").textContent = phone;
    document.getElementById("modalPrice").textContent = price;

    modal.style.display = "flex";
  });

  editBtn.addEventListener("click", () => {
    modal.style.display = "none";
    scrollToBooking();
  });

  confirmBtn.addEventListener("click", () => {
    modal.style.display = "none";

    const fullName = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const experience = document.getElementById("experience").value;
    const price =
      document
        .querySelector(`.book-btn[data-experience="${experience}"]`)
        ?.closest(".offer-card")
        ?.querySelector(".current-price")
        ?.textContent?.replace("AED ", "") || "0";

    fetch("/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        phone,
        clientId: "palm-jumeirah",
        price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("sessionId", data.sessionId);
          localStorage.setItem("bookingId", data.bookingId);
          localStorage.setItem("clientId", "palm-jumeirah");
          localStorage.setItem("price", price);
          localStorage.setItem("activityName", experience);

          window.location.href = "/date-time";
          return;
        }

        const messageDiv = document.getElementById("form-message");
        messageDiv.textContent = "Something went wrong. Try again.";
        messageDiv.style.display = "block";
        messageDiv.style.backgroundColor = "#f8d7da";
        messageDiv.style.color = "#721c24";
      })
      .catch((error) => {
        console.error("Error:", error);
        const messageDiv = document.getElementById("form-message");
        messageDiv.textContent = "Server error. Please try again.";
        messageDiv.style.display = "block";
        messageDiv.style.backgroundColor = "#f8d7da";
        messageDiv.style.color = "#721c24";
      });
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".offer-card, .categories-header, .booking-form-full, .testimonial-card, .promo-banner"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
});

// ✅ PHONE MASK + LIMIT
const phoneInput = document.getElementById("phone");
const prefix = "+971";

phoneInput.addEventListener("focus", () => {
  if (!phoneInput.value.startsWith(prefix)) {
    phoneInput.value = prefix;
  }
  setTimeout(() => {
    phoneInput.setSelectionRange(
      phoneInput.value.length,
      phoneInput.value.length
    );
  }, 0);
});

phoneInput.addEventListener("input", () => {
  if (!phoneInput.value.startsWith(prefix)) {
    phoneInput.value = prefix;
  }

  // ✅ Limit length: +971 + 9 digits = 13 chars total
  if (phoneInput.value.length > 13) {
    phoneInput.value = phoneInput.value.slice(0, 13);
  }
});

phoneInput.addEventListener("keydown", (e) => {
  if (
    phoneInput.selectionStart <= prefix.length &&
    (e.key === "Backspace" || e.key === "Delete")
  ) {
    e.preventDefault();
  }
});
