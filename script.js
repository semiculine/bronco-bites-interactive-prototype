"use strict";

const mealGrid = document.querySelector("#meal-grid");
const filterButtons = document.querySelectorAll(".filter-chip");
const emptyState = document.querySelector("#empty-state");
const availableCount = document.querySelector("#available-count");
const savedCount = document.querySelector("#saved-count");
const headerSavedCount = document.querySelector("#header-saved-count");
const pickupDialog = document.querySelector("#pickup-dialog");
const dialogMeal = document.querySelector("#dialog-meal");
const dialogLocation = document.querySelector("#dialog-location");
const pickupCode = document.querySelector("#pickup-code");
const closeDialogButton = document.querySelector(".dialog-close");

let mealsSaved = 1284;

function formatCount(count) {
  return count.toLocaleString("en-US");
}

function updateAvailableCount() {
  const meals = [...mealGrid.querySelectorAll(".meal-card")]
    .filter((card) => Number(card.querySelector("[data-portions]").textContent) > 0)
    .length;

  availableCount.textContent = String(meals);
}

function filterMeals(filter) {
  let visibleMeals = 0;

  for (const card of mealGrid.querySelectorAll(".meal-card")) {
    const diets = card.dataset.diets.split(" ");
    const matches = filter === "all" || diets.includes(filter);
    card.hidden = !matches;
    if (matches) visibleMeals += 1;
  }

  emptyState.hidden = visibleMeals > 0;
}

function showPickupDetails(button) {
  const card = button.closest(".meal-card");
  const title = button.dataset.meal;
  const location = card.querySelector(".locker-location").textContent.trim();
  const code = `BB-${Math.floor(1000 + Math.random() * 9000)}`;

  dialogMeal.textContent = title;
  dialogLocation.textContent = location;
  pickupCode.textContent = code;

  if (typeof pickupDialog.showModal === "function") {
    pickupDialog.showModal();
    return;
  }

  pickupDialog.setAttribute("open", "");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });

    filterMeals(button.dataset.filter);
  });
});

mealGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest(".pickup-button");
  if (!button || button.disabled) return;

  const portions = button.closest(".meal-card").querySelector("[data-portions]");
  const remaining = Number(portions.textContent);

  if (remaining === 1) {
    button.disabled = true;
    button.innerHTML = "All claimed <span aria-hidden=\"true\">✓</span>";
  }

  portions.textContent = String(remaining - 1);
  mealsSaved += 1;
  savedCount.textContent = formatCount(mealsSaved);
  headerSavedCount.textContent = formatCount(mealsSaved);
  updateAvailableCount();
  showPickupDetails(button);
});

closeDialogButton.addEventListener("click", () => {
  pickupDialog.close();
});

pickupDialog.addEventListener("click", (event) => {
  if (event.target === pickupDialog) pickupDialog.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && pickupDialog.open) pickupDialog.close();
});
