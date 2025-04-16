function toggleDayNight() {
  const body = document.body;
  const isNight = body.classList.contains("night");

  if (isNight) {
    body.classList.remove("night");
    body.classList.add("day");
    localStorage.setItem("timeOfDay", "day");
  } else {
    body.classList.remove("day");
    body.classList.add("night");
    localStorage.setItem("timeOfDay", "night");
  }

  // Optional: update UI or message log
  if (document.getElementById("log")) {
    logMessage('system', `It is now ${localStorage.getItem("timeOfDay")}.`);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const time = localStorage.getItem("timeOfDay") || "day";
  document.body.classList.add(time);
});
