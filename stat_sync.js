// Realtime Stats & Inventory Sync for Blogger Game UI
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let stats = JSON.parse(localStorage.getItem('stats')) || { xp: 0, cash: 0 };

function updateDisplay() {
  if (document.getElementById('liveCash')) {
    document.getElementById('liveCash').textContent = "$" + stats.cash;
  }
  if (document.getElementById('liveXP')) {
    document.getElementById('liveXP').textContent = stats.xp + " XP";
  }
  if (document.getElementById('liveInventory')) {
    document.getElementById('liveInventory').innerHTML = inventory.length
      ? inventory.map(item => "<li>" + item + "</li>").join("")
      : "<li>Empty</li>";
  }
}

function gainXP(amount) {
  stats.xp += amount;
  localStorage.setItem('stats', JSON.stringify(stats));
  updateDisplay();
}

function addCash(amount) {
  stats.cash += amount;
  localStorage.setItem('stats', JSON.stringify(stats));
  updateDisplay();
}

function addItem(item) {
  inventory.push(item);
  localStorage.setItem('inventory', JSON.stringify(inventory));
  updateDisplay();
}

// Monitor for changes from other tabs too
window.addEventListener("storage", function () {
  inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  stats = JSON.parse(localStorage.getItem('stats')) || { xp: 0, cash: 0 };
  updateDisplay();
});

window.addEventListener("load", updateDisplay);