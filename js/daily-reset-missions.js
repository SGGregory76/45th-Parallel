const today = new Date().toLocaleDateString();
if (localStorage.getItem("last_reset") !== today) {
  localStorage.clear(); // or just reset mission keys
  localStorage.setItem("last_reset", today);
}
