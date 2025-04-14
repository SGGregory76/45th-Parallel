// ----- GLOBAL GAME STATE -----
let player = {
  reputation: 50,
  wealth: 1000,
  mood: "neutral",
  // Crafted products (final drugs)
  inventory: {
    craftedDrugs: [] // Each item: { name, baseTypes, potency }
  },
  // Raw resources available for mixing; values represent available units.
  resources: {
    marijuana: 5,
    cocaine: 3,
    lsd: 2,
    oxytocin: 2
  }
};

// Market values for potential selling (for future use)
let market = {
  marijuana: 10,   // Base price per unit
  cocaine: 20,
  lsd: 50,
  oxytocin: 30
};

// Example faction standings (affecting NPC interactions)
let factions = {
  Suppliers: 50,
  Cartel: 50,
  Police: 50
};

const eventLog = [];
let dayCounter = 0;

// ----- UTILITY FUNCTIONS -----
function updateEventLog(message) {
  eventLog.push(message);
  const logDiv = document.getElementById("log");
  logDiv.innerHTML = eventLog.map(entry => `<div class="log-entry">${entry}</div>`).join("");
  logDiv.scrollTop = logDiv.scrollHeight;
}

function updateInventoryUI() {
  // Display crafted products
  const invDiv = document.getElementById("inventory-items");
  if (player.inventory.craftedDrugs.length === 0) {
    invDiv.innerHTML = "<p>No crafted drugs yet.</p>";
  } else {
    invDiv.innerHTML = player.inventory.craftedDrugs
      .map(item => `<div class="inventory-item">
                      <strong>${item.name}</strong><br>
                      Base: ${item.baseTypes.join(" + ")}<br>
                      Potency: ${item.potency}
                    </div>`)
      .join("");
  }
}

function updateResourceUI() {
  const resDiv = document.getElementById("resource-display");
  resDiv.innerHTML = `
    <div class="resource-item">Marijuana: ${player.resources.marijuana}</div>
    <div class="resource-item">Cocaine: ${player.resources.cocaine}</div>
    <div class="resource-item">LSD: ${player.resources.lsd}</div>
    <div class="resource-item">Oxytocin: ${player.resources.oxytocin}</div>
  `;
}

function updatePlayerStatsUI() {
  document.getElementById("wealth").textContent = player.wealth;
  document.getElementById("reputation").textContent = player.reputation;
  document.getElementById("mood").textContent = player.mood;
}

function updateMarketUI() {
  const marketDiv = document.getElementById("market");
  marketDiv.innerHTML = `
    <div class="market-item">Marijuana - $${market.marijuana}</div>
    <div class="market-item">Cocaine - $${market.cocaine}</div>
    <div class="market-item">LSD - $${market.lsd}</div>
    <div class="market-item">Oxytocin - $${market.oxytocin}</div>
  `;
}

function updateNPCListUI() {
  const npcDiv = document.getElementById("npc-list");
  npcDiv.innerHTML = npcList.map(npc => {
    return `
      <div class="npc-box">
        <h3>${npc.name} (${npc.type})</h3>
        <p>Status: ${npc.relationship}</p>
        <button onclick="npcInteract('${npc.name}')">Interact</button>
      </div>
    `;
  }).join("");
}

// ----- OBJECTIVE-BASED RESOURCE ACQUISITION -----
// Instead of clicking to gather resources, the player now earns raw resources through objectives like fighting, pickpocketing, and completing missions.

// Combat: Gains resources and wealth
function fight() {
  let r = Math.random();
  let outcome;
  if (r < 0.4) outcome = "success";
  else if (r < 0.7) outcome = "neutral";
  else outcome = "failure";

  let message = "Fight outcome: ";
  if (outcome === "success") {
    let gainMoney = 200;
    // Gain a random number (1-3) of Marijuana units as loot from the fight.
    let resourceGain = Math.floor(Math.random() * 3) + 1;
    player.wealth += gainMoney;
    player.resources.marijuana += resourceGain;
    message += `SUCCESS! Gained $${gainMoney} and ${resourceGain} units of Marijuana.`;
  } else if (outcome === "neutral") {
    message += "Neutral outcome. No changes.";
  } else {
    let lossMoney = 150;
    player.wealth = Math.max(0, player.wealth - lossMoney);
    message += `FAILURE! Lost $${lossMoney}.`;
  }
  updateEventLog(message);
  updatePlayerStatsUI();
  updateResourceUI();
}

// Pickpocket: Gains resources and wealth
function pickpocket() {
  let r = Math.random();
  let outcome;
  if (r < 0.5) outcome = "success";
  else if (r < 0.8) outcome = "neutral";
  else outcome = "failure";

  let message = "Pickpocket outcome: ";
  if (outcome === "success") {
    let gainMoney = 150;
    let resourceGain = Math.floor(Math.random() * 2) + 1; // Gains 1-2 units of Cocaine, for example.
    player.wealth += gainMoney;
    player.resources.cocaine += resourceGain;
    message += `SUCCESS! Gained $${gainMoney} and ${resourceGain} units of Cocaine.`;
  } else if (outcome === "neutral") {
    message += "Neutral. No change.";
  } else {
    let lossMoney = 75;
    player.wealth = Math.max(0, player.wealth - lossMoney);
    message += `FAILURE! Lost $${lossMoney}.`;
  }
  updateEventLog(message);
  updatePlayerStatsUI();
  updateResourceUI();
}

// Complete a mission: an objective that rewards multiple resources
function completeMission() {
  let rewardMarijuana = Math.floor(Math.random() * 3) + 2; // 2-4 units
  let rewardOther = Math.floor(Math.random() * 2) + 1; // 1-2 units; could be applied to cocaine.
  player.resources.marijuana += rewardMarijuana;
  player.resources.cocaine += rewardOther;
  updateEventLog(`Mission complete! You earned ${rewardMarijuana} Marijuana and ${rewardOther} Cocaine.`);
  updateResourceUI();
}

// ----- DRUG MIXING SYSTEM -----
// Requires at least 2 different raw resource types. Consumes 1 unit of each chosen type and creates a crafted drug with random effects.
function mixDrugs() {
  // Check available raw resource types
  const availableTypes = Object.keys(player.resources).filter(type => player.resources[type] > 0);
  
  if (availableTypes.length < 2) {
    updateEventLog("Not enough distinct raw resources to mix drugs. Complete missions or fight for more!");
    return;
  }
  
  // For this mix, let the player choose which two to mix via prompts (you can later create a UI for selection)
  let type1 = prompt("Enter the first resource type to mix (e.g., marijuana):", availableTypes[0]);
  let type2 = prompt("Enter the second resource type to mix (e.g., cocaine):", availableTypes[1]);
  
  // Convert inputs to lowercase for consistency
  type1 = type1.toLowerCase();
  type2 = type2.toLowerCase();
  
  if (type1 === type2) {
    updateEventLog("You must choose two different types to mix.");
    return;
  }
  
  // Check if the player has at least 1 unit of each resource
  if (!player.resources[type1] || !player.resources[type2]) {
    updateEventLog("Insufficient resources for the selected types.");
    return;
  }
  
  // Deduct one unit of each resource
  player.resources[type1]--;
  player.resources[type2]--;
  
  // Generate a crafted drug with random potency and effects
  let basePotency = 10;
  let potencyBonus = Math.floor(Math.random() * 6); // 0-5 bonus
  let finalPotency = basePotency + potencyBonus;
  
  // Allow custom naming
  let customName = document.getElementById("strain-name").value;
  if (!customName) {
    customName = prompt("Enter a name for your new crafted drug:", "Hybrid Mix");
  }
  let craftedName = customName || "Hybrid Mix";
  
  // Random outcome: success, neutral, or failure
  let outcomeRand = Math.random();
  let npcEffect = 0, playerEffect = 0;
  if (outcomeRand < 0.33) {
    npcEffect = 10;
    playerEffect = 200;
    updateEventLog("Mixing outcome: SUCCESS! Your blend is exceptional.");
  } else if (outcomeRand < 0.66) {
    npcEffect = 0;
    playerEffect = 0;
    updateEventLog("Mixing outcome: NEUTRAL. The product is average.");
  } else {
    npcEffect = -10;
    playerEffect = -100;
    finalPotency = Math.max(5, finalPotency - 5);
    updateEventLog("Mixing outcome: FAILURE. The blend is of poor quality.");
  }
  
  // Apply effects
  player.wealth += playerEffect;
  player.reputation += npcEffect;
  
  // Create the crafted product and add it to inventory
  const newDrug = {
    name: craftedName,
    baseTypes: [type1, type2],
    potency: finalPotency
  };
  player.inventory.craftedDrugs.push(newDrug);
  
  updateInventoryUI();
  updateResourceUI();
  updatePlayerStatsUI();
}

// ----- NPC BEHAVIOR TREES -----
// Enhanced NPC interactions: three outcomes based on NPC type and random chance.
const npcList = [
  { name: "Carlos", type: "Supplier", relationship: "Friendly", behavior: "supportive", reputationEffect: 10 },
  { name: "Diana", type: "Rival", relationship: "Hostile", behavior: "aggressive", reputationEffect: -10 },
  { name: "Officer John", type: "Cop", relationship: "Neutral", behavior: "punishing", reputationEffect: -5 }
];

function npcInteract(npcName) {
  const npc = npcList.find(n => n.name === npcName);
  if (!npc) return;
  
  let outcome, r = Math.random();
  if (npc.behavior === "supportive") {
    outcome = r < 0.6 ? "success" : (r < 0.85 ? "neutral" : "failure");
  } else if (npc.behavior === "aggressive") {
    outcome = r < 0.3 ? "success" : (r < 0.6 ? "neutral" : "failure");
  } else {
    outcome = r < 0.4 ? "success" : (r < 0.7 ? "neutral" : "failure");
  }
  
  let message = `${npc.name}'s interaction: `;
  if (outcome === "success") {
    player.reputation += npc.reputationEffect;
    let bonus = 100;
    player.wealth += bonus;
    message += `SUCCESS! Gained reputation and $${bonus}.`;
  } else if (outcome === "neutral") {
    message += "Neutral outcome.";
  } else {
    player.reputation += npc.reputationEffect; // negative effect
    let penalty = 50;
    player.wealth = Math.max(0, player.wealth - penalty);
    message += `FAILURE! Lost reputation and $${penalty}.`;
  }
  updateEventLog(message);
  updatePlayerStatsUI();
}

// ----- COMBAT & PICKPOCKETING ----- (three outcomes remain the same)
function fight() {
  let r = Math.random();
  let outcome = (r < 0.4) ? "success" : (r < 0.7) ? "neutral" : "failure";
  let message = "Fight outcome: ";
  if (outcome === "success") {
    let gain = 200;
    player.wealth += gain;
    message += `SUCCESS! Gained $${gain}.`;
  } else if (outcome === "neutral") {
    message += "Neutral outcome. No change.";
  } else {
    let loss = 150;
    player.wealth = Math.max(0, player.wealth - loss);
    message += `FAILURE! Lost $${loss}.`;
  }
  updateEventLog(message);
  updatePlayerStatsUI();
}

function pickpocket() {
  let r = Math.random();
  let outcome = (r < 0.5) ? "success" : (r < 0.8) ? "neutral" : "failure";
  let message = "Pickpocket outcome: ";
  if (outcome === "success") {
    let gain = 150;
    player.wealth += gain;
    message += `SUCCESS! Gained $${gain}.`;
  } else if (outcome === "neutral") {
    message += "Neutral. No change.";
  } else {
    let loss = 75;
    player.wealth = Math.max(0, player.wealth - loss);
    message += `FAILURE! Lost $${loss}.`;
  }
  updateEventLog(message);
  updatePlayerStatsUI();
}

// ----- MARKET SIMULATION (Three Outcomes) -----
function triggerMarketEvent() {
  let r = Math.random();
  if (r < 0.33) {
    market.marijuana += 5;
    market.cocaine += 5;
    market.lsd += 10;
    market.oxytocin += 5;
    updateEventLog("Market boom! Prices have increased.");
  } else if (r < 0.66) {
    updateEventLog("Market is stable.");
  } else {
    market.marijuana = Math.max(1, market.marijuana - 5);
    market.cocaine = Math.max(1, market.cocaine - 5);
    market.lsd = Math.max(1, market.lsd - 10);
    market.oxytocin = Math.max(1, market.oxytocin - 5);
    updateEventLog("Market crash! Prices have dropped.");
  }
  updateMarketUI();
}

// ----- TIME-BASED GAME LOOP -----
function simulateDay() {
  dayCounter++;
  updateEventLog(`Day ${dayCounter} begins...`);
  triggerMarketEvent();
  // Random chance to trigger an NPC interaction event
  if (Math.random() < 0.3) {
    const randomNpc = npcList[Math.floor(Math.random() * npcList.length)];
    npcInteract(randomNpc.name);
  }
}
setInterval(simulateDay, 20000); // Every 20 seconds, a new day

// ----- SAVE & LOAD SYSTEM -----
function saveGame() {
  const state = { player, market, dayCounter, eventLog };
  localStorage.setItem("drugSimSave", JSON.stringify(state));
  updateEventLog("Game saved.");
}

function loadGame() {
  const state = JSON.parse(localStorage.getItem("drugSimSave"));
  if (state) {
    player = state.player;
    market = state.market;
    dayCounter = state.dayCounter;
    eventLog.length = 0;
    eventLog.push(...state.eventLog);
    updateEventLog("Game loaded.");
    updateInventoryUI();
    updateResourceUI();
    updateMarketUI();
    updatePlayerStatsUI();
  } else {
    updateEventLog("No saved game found.");
  }
}

// ----- INITIALIZATION -----
function initializeGame() {
  if (!player.inventory.craftedDrugs) player.inventory.craftedDrugs = [];
  updateInventoryUI();
  updateResourceUI();
  updateMarketUI();
  updateEventLog("Game Started: Welcome to 45th Parallel. Build your empire!");
  updatePlayerStatsUI();
}
window.onload = initializeGame;
