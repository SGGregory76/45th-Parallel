// Global player state
const player = {
  wealth: 1000,
  reputation: 50,
  mood: "neutral",
  experience: 0,
  level: 1,
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

// Utility Functions
function updateStats() {
  const get = id => document.getElementById(id);
  if (get("wealth")) get("wealth").textContent = player.wealth;
  if (get("reputation")) get("reputation").textContent = player.reputation;
  if (get("mood")) get("mood").textContent = player.mood;
  if (get("experience")) get("experience").textContent = player.experience;
  if (get("level")) get("level").textContent = player.level;
}

function updateLog(message) {
  eventLog.push(message);
  const logBox = document.getElementById("log");
  if (logBox) {
    logBox.innerHTML = eventLog.slice(-50).map(msg => `<div class='log-entry'>${msg}</div>`).join('');
    logBox.scrollTop = logBox.scrollHeight;
  }
}

function gainXP(amount) {
  player.experience += amount;
  const xpNeeded = player.level * 100;
  if (player.experience >= xpNeeded) {
    player.level++;
    player.experience = 0;
    updateLog(`LEVEL UP! You are now level ${player.level}.`);
  }
  updateStats();
}

// Rendering Functions
function renderInventory() {
  const container = document.getElementById("inventory-items");
  if (!container) return;
  container.innerHTML = player.inventory.map(d =>
    `<div class='inventory-item'><strong>${d.name}</strong><br>Type: ${d.type}<br>Potency: ${d.potency}</div>`
  ).join('');
}

function renderResources() {
  const container = document.getElementById("resource-display");
  if (!container) return;
  container.innerHTML = Object.entries(player.resources).map(([k,v]) =>
    `<div class='resource-item'>${k}: ${v}</div>`).join('');
}

function renderShop() {
  const container = document.getElementById("shop-buttons");
  if (!container) return;
  container.innerHTML = Object.entries(resourceCosts).map(([r, cost]) =>
    `<button onclick="buyResource('${r}')">Buy ${r} ($${cost})</button>`
  ).join('');
}

function renderCraftButtons() {
  const container = document.getElementById("craft-buttons");
  if (!container) return;
  container.innerHTML = Object.keys(drugRecipes).map(drug =>
    `<button onclick="mixDrug('${drug}')">Mix ${drug}</button>`
  ).join('');
}

function renderSellButtons() {
  const container = document.getElementById("sell-buttons");
  if (!container) return;
  container.innerHTML = player.inventory.map((item, i) =>
    `<button onclick="sellDrug(${i})">Sell ${item.name} ($${item.potency * 3})</button>`
  ).join('');
}

function renderNPCs() {
  const container = document.getElementById("npc-list");
  if (!container) return;
  container.innerHTML = npcList.map(n =>
    `<div class='npc-box'><strong>${n.name}</strong><br>(${n.type})<br><button onclick="npcInteract('${n.name}')">Interact</button></div>`
  ).join('');
}

function renderMarket() {
  const container = document.getElementById("market");
  if (!container) return;
  container.innerHTML = Object.entries(market).map(([k,v]) =>
    `<div class='market-item'>${k}: $${v}</div>`).join('');
}

// Core Logic
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
  const nameInput = document.getElementById("strain-name")?.value || `${type} Mix`;
  const drug = { name: nameInput, type, potency };
  player.inventory.push(drug);
  updateLog(`Mixed ${type}: ${drug.name} (Potency ${potency})`);
  renderInventory();
  renderResources();
  renderSellButtons();
  gainXP(10);
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
  gainXP(5);
}

function npcInteract(name) {
  const npc = npcList.find(n => n.name === name);
  const roll = Math.random();
  let message = `${npc.name} (${npc.type}) interaction: `;
  if (roll < 0.33) {
    player.reputation += 5;
    message += "SUCCESS! Reputation increased.";
    gainXP(10);
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
    gainXP(15);
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
    gainXP(10);
  } else {
    player.wealth = Math.max(0, player.wealth - 75);
    updateLog("Pickpocket failed. Lost $75.");
  }
  updateStats();
}

function completeMission() {
  const reward = 100 + player.level * 25;
  const xp = 25 + player.level * 5;
  player.wealth += reward;
  player.resources.seeds += 1;
  player.resources.water += 1;
  updateLog(`Mission complete! +$${reward}, +1 seed, +1 water`);
  gainXP(xp);
  updateStats();
  renderResources();
}

function simulateDay() {
  dayCounter++;
  updateLog(`Day ${dayCounter} begins.`);
  const shift = Math.floor(Math.random() * 3);
  if (shift === 1) {
    Object.keys(market).forEach(k => market[k] += 5);
    updateLog("Market boom! Prices increased.");
  } else if (shift === 2) {
    Object.keys(market).forEach(k => market[k] = Math.max(1, market[k] - 5));
    updateLog("Market crash! Prices decreased.");
  }
  const npc = npcList[Math.floor(Math.random() * npcList.length)];
  npcInteract(npc.name);
  renderMarket();
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

// Init
window.addEventListener("DOMContentLoaded", () => {
  updateStats();
  renderResources();
  renderInventory();
  renderShop();
  renderCraftButtons();
  renderSellButtons();
  renderNPCs();
  renderMarket();
  updateLog("Welcome to 45th Parallel!");

  const byId = id => document.getElementById(id);
  if (byId("fight-btn")) byId("fight-btn").addEventListener("click", fight);
  if (byId("pickpocket-btn")) byId("pickpocket-btn").addEventListener("click", pickpocket);
  if (byId("mission-btn")) byId("mission-btn").addEventListener("click", completeMission);
  if (byId("save-btn")) byId("save-btn").addEventListener("click", saveGame);
  if (byId("load-btn")) byId("load-btn").addEventListener("click", loadGame);

  setInterval(simulateDay, 30000);
});
