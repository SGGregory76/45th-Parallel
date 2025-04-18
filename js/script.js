let ingredients = [];
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function saveInventory() {
  localStorage.setItem('inventory', JSON.stringify(inventory));
}

function loadInventory() {
  const invBox = document.getElementById("inventoryList");
  if (!invBox) return;
  invBox.innerHTML = inventory.length ? inventory.map(i => "<li>" + i + "</li>").join("") : "<li>No items yet.</li>";
}

function showScreen(screenId) {
  document.querySelectorAll('.app-screen').forEach(el => el.style.display = 'none');
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.style.display = 'block';
    if (screenId === 'inventoryScreen') loadInventory();
  }
}

function selectIngredient(icon) {
  const resultBox = document.getElementById('craftResult');
  resultBox.textContent = "";
  if (ingredients.length >= 2) {
    resultBox.innerHTML = "You can only combine 2 items.";
    return;
  }
  ingredients.push(icon);
  document.getElementById('selectedItems').textContent = ingredients.join(" + ");
}

function craftItem() {
  const resultBox = document.getElementById('craftResult');
  if (ingredients.length < 2) {
    resultBox.innerHTML = "Select two ingredients to synthesize.";
    return;
  }

  const combo = ingredients.join("");
  let result = "Unknown mixture.";
  if (combo === "🌿🌿") result = "Custom Strain";
  else if (combo === "🌿💊") result = "THC Capsule";
  else if (combo === "⚗️💉") result = "Heroin";
  else if (combo === "🔫⚙️") result = "Concealed Weapon";
  else if (combo === "⚗️💊") result = "Designer Pill";

  if (result !== "Unknown mixture.") {
    inventory.push(result);
    saveInventory();
  }

  resultBox.innerHTML = "<strong>Result:</strong> " + result;
  ingredients = [];
  document.getElementById('selectedItems').textContent = "None";
}