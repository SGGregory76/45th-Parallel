let ingredients = [];

function openApp(app) {
  const window = document.getElementById("appWindow");
  if (app === "craft") {
    window.innerHTML = `
      <h4>Crafting Lab</h4>
      <div style='display:flex;gap:10px;margin-bottom:10px;'>
        <span onclick="selectIngredient('🌿')" style="cursor:pointer;">🌿</span>
        <span onclick="selectIngredient('💊')" style="cursor:pointer;">💊</span>
        <span onclick="selectIngredient('⚗️')" style="cursor:pointer;">⚗️</span>
        <span onclick="selectIngredient('💉')" style="cursor:pointer;">💉</span>
        <span onclick="selectIngredient('🔫')" style="cursor:pointer;">🔫</span>
        <span onclick="selectIngredient('⚙️')" style="cursor:pointer;">⚙️</span>
      </div>
      <div><strong>Selected:</strong> <span id="selectedItems">None</span></div>
      <button onclick="craftItem()">Synthesize</button>
      <div id="craftResult" style="margin-top:10px;"></div>
    `;
  } else {
    window.innerHTML = "<h4>" + app.charAt(0).toUpperCase() + app.slice(1) + "</h4><p>Content goes here.</p>";
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
  if (combo === "🌿🌿") result = "Custom Strain Created!";
  else if (combo === "🌿💊") result = "THC Capsule";
  else if (combo === "⚗️💉") result = "Heroin";
  else if (combo === "🔫⚙️") result = "Concealed Weapon";
  else if (combo === "⚗️💊") result = "Designer Pill";

  resultBox.innerHTML = "<strong>Result:</strong> " + result;
  ingredients = [];
  document.getElementById('selectedItems').textContent = "None";
}