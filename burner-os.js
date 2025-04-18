<!-- 45th Parallel - Burner OS Phone UI (Blogger Safe Version) -->
<div style="max-width:300px;margin:30px auto;padding:15px;border:2px solid #444;border-radius:20px;background:#1b1b1b;color:#fff;font-family:'Segoe UI',sans-serif;">
  <div style="text-align:center;font-weight:bold;font-size:18px;margin-bottom:15px;">Burner OS</div>

  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:15px;text-align:center;">
    <div onclick="openApp('missions')" style="background:#222;padding:10px;border-radius:12px;cursor:pointer;">
      📋<div style="font-size:12px;color:#ccc;">Missions</div>
    </div>
    <div onclick="openApp('contacts')" style="background:#222;padding:10px;border-radius:12px;cursor:pointer;">
      👤<div style="font-size:12px;color:#ccc;">Contacts</div>
    </div>
    <div onclick="openApp('inventory')" style="background:#222;padding:10px;border-radius:12px;cursor:pointer;">
      🎒<div style="font-size:12px;color:#ccc;">Inventory</div>
    </div>
    <div onclick="openApp('craft')" style="background:#222;padding:10px;border-radius:12px;cursor:pointer;">
      ⚗️<div style="font-size:12px;color:#ccc;">Craft</div>
    </div>
    <div onclick="openApp('map')" style="background:#222;padding:10px;border-radius:12px;cursor:pointer;">
      🗺️<div style="font-size:12px;color:#ccc;">Map</div>
    </div>
    <div onclick="openApp('log')" style="background:#222;padding:10px;border-radius:12px;cursor:pointer;">
      🧾<div style="font-size:12px;color:#ccc;">Log</div>
    </div>
  </div>

  <div id="appWindow" style="background:#000;border:1px solid #333;border-radius:10px;padding:10px;min-height:280px;">
    <p>Select an app to begin.</p>
  </div>
</div>

<script>
let ingredients = [];

function openApp(app) {
  const window = document.getElementById("appWindow");

  if (app === "craft") {
    window.innerHTML = `
      <h4>Crafting Lab</h4>
      <div style='display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap;'>
        <span onclick="selectIngredient('🌿')" style="cursor:pointer;">🌿</span>
        <span onclick="selectIngredient('💊')" style="cursor:pointer;">💊</span>
        <span onclick="selectIngredient('⚗️')" style="cursor:pointer;">⚗️</span>
        <span onclick="selectIngredient('💉')" style="cursor:pointer;">💉</span>
        <span onclick="selectIngredient('🔫')" style="cursor:pointer;">🔫</span>
        <span onclick="selectIngredient('⚙️')" style="cursor:pointer;">⚙️</span>
      </div>
      <div><strong>Selected:</strong> <span id="selectedItems">None</span></div>
      <button onclick="craftItem()" style="margin-top:10px;padding:8px;width:100%;background:#222;border:none;color:#fff;border-radius:6px;">Synthesize</button>
      <div id="craftResult" style="margin-top:10px;font-size:0.9em;color:#ccc;"></div>
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
</script>
