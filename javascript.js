// ----- GLOBAL STATE -----
const player = {
  reputation: 50,
  wealth: 1000,
  mood: "neutral",
  inventory: [],
  resources: {
    seeds: 5,
    water: 5,
    fertilizer: 5,
    cocaLeaves: 3,
    cocaineChemicals: 2,
    lsdChemicals: 1,
    adderallPrecursors: 1,
    oxytocinPrecursors: 1
  }
};

const market = {
  marijuana: 10,
  cocaine: 20,
  lsd: 50,
  oxytocin: 30
};

const resourceCosts = {
  seeds: 5,
  water: 2,
  fertilizer: 3,
  cocaLeaves: 10,
  cocaineChemicals: 15,
  lsdChemicals: 20,
  adderallPrecursors: 25,
  oxytocinPrecursors: 18
};

const drugRecipes = {
  Marijuana: ["seeds", "water", "fertilizer"],
  Cocaine: ["cocaLeaves", "cocaineChemicals"],
  LSD: ["lsdChemicals", "water"],
  Adderall: ["adderallPrecursors", "water"],
  Oxytocin: ["oxytocinPrecursors", "fertilizer"]
};

const npcList = [
  { name: "Carlos", type: "Supplier", behavior: "supportive" },
  { name: "Diana", type: "Rival", behavior: "aggressive" },
  { name: "Officer John", type: "Cop", behavior: "punishing" },
  { name: "Lana", type: "Dealer", behavior: "neutral" },
  { name: "Smokey", type: "Junkie", behavior: "desperate" }
];

let eventLog = [];
let dayCounter = 0;

// ----- DOM UPDATES -----
function updateStats() {
  document.getElementById("wealth").textContent = player.wealth;
  document.getElementById("reputation").textContent = player.reputation;
  document.getElementById("mood").textContent = player.mood;
}

function updateLog(message) {
  eventLog.push(message);
  const logBox = document.getElementById("log");
  logBox.innerHTML = eventLog.slice(-50).map(msg => `<div class='log-entry'>${msg}</div>`).join('');
  logBox.scrollTop = logBox.scrollHeight;
}

function renderInventory() {
  const container = document.getElementById("inventory-items");
  container.innerHTML = player.inventory.map(d =>
    `<div class='inventory-item'><strong>${d.name}</strong><br>Type: ${d.type}<br>Potency: ${d.potency}</div>`
  ).join('');
}

function renderResources() {
  const container = document.getElementById("resource-display");
  container.innerHTML = Object.entries(player.resources).map(([k,v]) =>
    `<div class='resource-item'>${k}: ${v}</div>`).join('');
}

function renderShop() {
  const container = document.getElementById("shop-buttons");
  container.innerHTML = Object.entries(resourceCosts).map(([r, cost]) =>
    `<button onclick="buyResource('${r}')">Buy ${r} ($${cost})</button>`
  ).join('');
}

function renderCraftButtons() {
  const container = document.getElementById("craft-buttons");
  container.innerHTML = Object.keys(drugRecipes).map(drug =>
    `<button onclick="mixDrug('${drug}')">Mix ${drug}</button>`
  ).join('');
}

function renderSellButtons() {
  const container = document.getElementById("sell-buttons");
  container.innerHTML = player.inventory.map((item, i) =>
    `<button onclick="sellDrug(${i})">Sell ${item.name} ($${item.potency * 3})</button>`
  ).join('');
}

function renderNPCs() {
  const container = document.getElementById("npc-list");
  container.innerHTML = npcList.map(n =>
    `<div class='npc-box'><strong>${n.name}</strong><br>(${n.type})<br><button onclick="npcInteract('${n.name}')">Interact</button></div>`
  ).join('');
}

function renderMarket() {
  const container = document.getElementById("market");
  container.innerHTML = Object.entries(market).map(([k,v]) =>
    `<div class='market-item'>${k}: $${v}</div>`).join('');
}

// ----- GAME LOGIC -----
function buyResource(type) {
  if (player.wealth >= resourceCosts[type]) {
    player.wealth -= resourceCosts[type];
    player.resources[type]++;
    updateLog(`Bought 1 ${type}`);
    updateStats();
    renderResources();
  } else {
    updateLog(`Not enough money for ${type}`);
  }
}

function mixDrug(type) {
  const recipe = drugRecipes[type];
  const canCraft = recipe.every(r => player.resources[r] >= 1);
  if (!canCraft) {
    updateLog(`Not enough ingredients to mix ${type}`);
    return;
  }
  recipe.forEach(r => player.resources[r]--);
  const potency = Math.floor(Math.random() * 10) + 10;
  const nameInput = document.getElementById("strain-name").value || `${type} Mix`;
  const drug = { name: nameInput, type, potency };
  player.inventory.push(drug);
  updateLog(`Mixed ${type}: ${nameInput} (Potency ${potency})`);
  renderInventory();
  renderResources();
  renderSellButtons();
}

function sellDrug(index) {
  const drug = player.inventory[index];
  const value = drug.potency * 3;
  player.wealth += value;
  updateLog(`Sold ${drug.name} for $${value}`);
  player.inventory.splice(index, 1);
  renderInventory();
  updateStats();
  renderSellButtons();
}

function npcInteract(name) {
  const npc = npcList.find(n => n.name === name);
  const roll = Math.random();
  let message = `${npc.name} (${npc.type}) interaction: `;
  if (roll < 0.33) {
    player.reputation += 5;
    message += "SUCCESS! Reputation increased.";
  } else if (roll < 0.66) {
    message += "Neutral outcome.";
  } else {
    player.reputation -= 5;
    message += "FAILURE! Reputation decreased.";
  }
  updateLog(message);
  updateStats();
}

function fight() {
  const roll = Math.random();
  if (roll < 0.4) {
    player.wealth += 200;
    updateLog("Fight won! $200 gained.");
  } else if (roll < 0.7) {
    updateLog("Fight was a draw.");
  } else {
    player.wealth = Math.max(0, player.wealth - 150);
    updateLog("Fight lost. Lost $150.");
  }
  updateStats();
}

function pickpocket() {
  const roll = Math.random();
  if (roll < 0.5) {
    player.wealth += 150;
    updateLog("Pickpocket successful. $150 gained.");
  } else {
    player.wealth = Math.max(0, player.wealth - 75);
    updateLog("Pickpocket failed. Lost $75.");
  }
  updateStats();
}

function completeMission() {
  player.resources.seeds += 2;
  player.resources.water += 1;
  player.wealth += 100;
  updateLog("Mission complete! +2 seeds, +1 water, +$100");
  renderResources();
  updateStats();
}

function saveGame() {
  const state = { player, eventLog, dayCounter };
  localStorage.setItem("45thSave", JSON.stringify(state));
  updateLog("Game saved.");
}

function loadGame() {
  const saved = JSON.parse(localStorage.getItem("45thSave"));
  if (!saved) return;
  Object.assign(player, saved.player);
  eventLog = saved.eventLog;
  dayCounter = saved.dayCounter;
  updateLog("Game loaded.");
  updateStats();
  renderResources();
  renderInventory();
  renderSellButtons();
}

function simulateDay() {
  dayCounter++;
  updateLog(`Day ${dayCounter} begins.`);
  if (Math.random() < 0.5) {
    const npc = npcList[Math.floor(Math.random() * npcList.length)];
    npcInteract(npc.name);
  }
  renderMarket();
}

// ----- INIT -----
document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  renderResources();
  renderInventory();
  renderShop();
  renderCraftButtons();
  renderSellButtons();
  renderNPCs();
  renderMarket();
  updateLog("Welcome to 45th Parallel!");

  document.getElementById("fight-btn").addEventListener("click", fight);
  document.getElementById("pickpocket-btn").addEventListener("click", pickpocket);
  document.getElementById("mission-btn").addEventListener("click", completeMission);
  document.getElementById("save-btn").addEventListener("click", saveGame);
  document.getElementById("load-btn").addEventListener("click", loadGame);

  setInterval(simulateDay, 30000);
});
