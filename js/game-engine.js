
// Base Game Engine for 45th Parallel (Blogger Version)

const defaultGameData = {
  cash: 0,
  heat: 0,
  rep: 0,
  energy: 100,
  inventory: ['1x Weak Weed (Starter)'],
  npcReputations: {}
};

// Load or initialize game data
let gameData = JSON.parse(localStorage.getItem("gameData")) || defaultGameData;

function saveGame() {
  localStorage.setItem("gameData", JSON.stringify(gameData));
}

function updateUI() {
  if (document.getElementById("cash")) document.getElementById("cash").innerText = gameData.cash;
  if (document.getElementById("heat")) document.getElementById("heat").innerText = gameData.heat;
  if (document.getElementById("rep")) document.getElementById("rep").innerText = gameData.rep;
  if (document.getElementById("energy")) document.getElementById("energy").innerText = gameData.energy;
}

function addToInventory(item) {
  gameData.inventory.push(item);
  saveGame();
}

function changeRep(amount, npc = null) {
  if (npc) {
    if (!gameData.npcReputations[npc]) gameData.npcReputations[npc] = 0;
    gameData.npcReputations[npc] += amount;
  } else {
    gameData.rep += amount;
  }
  saveGame();
}

function changeHeat(amount) {
  gameData.heat += amount;
  if (gameData.heat < 0) gameData.heat = 0;
  saveGame();
}

function changeCash(amount) {
  gameData.cash += amount;
  if (gameData.cash < 0) gameData.cash = 0;
  saveGame();
}

function changeEnergy(amount) {
  gameData.energy += amount;
  if (gameData.energy > 100) gameData.energy = 100;
  if (gameData.energy < 0) gameData.energy = 0;

  function incrementActionCounter() {
  let count = parseInt(localStorage.getItem("actionCount") || "0");
  count++;
  localStorage.setItem("actionCount", count);

  if (count % 10 === 0) { // every 10 actions = switch time
    toggleDayNight();
  }
}

  saveGame();
}

function getNPCRep(npc) {
  return gameData.npcReputations[npc] || 0;
}
let ingredients = [];

function selectIngredient(icon) {
  if (ingredients.length < 2) {
    ingredients.push(icon);
    document.getElementById('selectedItems').textContent = ingredients.join(" + ");
  }
}

function craftItem() {
  const resultBox = document.getElementById('craftResult');
  const combo = ingredients.join("");

  let result = "Unknown mix.";
  if (combo === "🌿🌿") result = "Custom Strain Created!";
  else if (combo === "🌿💊") result = "THC Capsule";
  else if (combo === "⚗️💉") result = "Heroin";
  else if (combo === "🔫⚙️") result = "Concealed Weapon";
  else if (combo === "⚗️💊") result = "Designer Pill";

  resultBox.innerHTML = `<strong>Result:</strong> ${result}`;
  ingredients = [];
  document.getElementById('selectedItems').textContent = "";
}
let ingredients = [];

function selectIngredient(icon) {
  if (ingredients.length < 2) {
    ingredients.push(icon);
    document.getElementById('selectedItems').textContent = ingredients.join(" + ");
  }
}

function craftItem() {
  const resultBox = document.getElementById('craftResult');
  const combo = ingredients.join("");

  let result = "Unknown mix.";
  if (combo === "🌿🌿") result = "Custom Strain Created!";
  else if (combo === "🌿💊") result = "THC Capsule";
  else if (combo === "⚗️💉") result = "Heroin";
  else if (combo === "🔫⚙️") result = "Concealed Weapon";
  else if (combo === "⚗️💊") result = "Designer Pill";

  resultBox.innerHTML = `<strong>Result:</strong> ${result}`;
  ingredients = [];
  document.getElementById('selectedItems').textContent = "";
}

// Auto update UI on script load
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
});
<link rel="stylesheet" href="https://yourusername.github.io/45th-parallel-game/css/npc-ui.css">
