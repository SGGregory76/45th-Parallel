// ---- GLOBAL GAME STATE ----
let player = {
    reputation: 50,
    wealth: 1000,
    mood: "neutral",
    // Crafted products inventory (final products after mixing)
    inventory: {
        craftedDrugs: [] // Each item: { name, baseTypes, potency }
    },
    // Raw resources available for mixing. Values represent available units.
    resources: {
        marijuana: 5,
        cocaine: 3,
        lsd: 2,
        oxytocin: 2
    }
};

// Example factions (for NPC effects)
let factions = {
    Suppliers: 50,
    Cartel: 50,
    Police: 50
};

const eventLog = [];
let objectives = {
    firstMix: false
};

// ---- UTILITY FUNCTIONS ----
function updateEventLog(message) {
    eventLog.push(message);
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = eventLog.map(entry => `<div class="log-entry">${entry}</div>`).join('');
    logDiv.scrollTop = logDiv.scrollHeight;
}

function updateInventoryUI() {
    // Display the crafted inventory items
    const invDiv = document.getElementById('inventory-items');
    if (player.inventory.craftedDrugs.length === 0) {
        invDiv.innerHTML = "<p>No crafted drugs yet.</p>";
    } else {
        invDiv.innerHTML = player.inventory.craftedDrugs.map((item, index) => {
            return `<div class="inventory-item">
                      <strong>${item.name}</strong><br>
                      Base: ${item.baseTypes.join(' + ')}<br>
                      Potency: ${item.potency}
                    </div>`;
        }).join('');
    }
}

function updateResourceUI() {
    const resDiv = document.getElementById('resource-display');
    resDiv.innerHTML = `
        <div class="resource-item">Marijuana: ${player.resources.marijuana}</div>
        <div class="resource-item">Cocaine: ${player.resources.cocaine}</div>
        <div class="resource-item">LSD: ${player.resources.lsd}</div>
        <div class="resource-item">Oxytocin: ${player.resources.oxytocin}</div>
    `;
}

function updatePlayerStatsUI() {
    document.getElementById('wealth').textContent = player.wealth;
    document.getElementById('reputation').textContent = player.reputation;
    document.getElementById('mood').textContent = player.mood;
}

// ---- MIXING SYSTEM WITH RANDOM EFFECTS ----
// This function checks if the player has at least 2 different types of drugs available.
// If so, it randomly selects 2 distinct types (or you might extend it by letting the player choose)
// then applies random effects.
function mixDrugs() {
    // Get list of raw resource types with at least 1 unit available
    const availableTypes = Object.keys(player.resources).filter(type => player.resources[type] > 0);
    
    // Require at least two different types
    if (availableTypes.length < 2) {
        updateEventLog("Not enough distinct resources to mix drugs. Gather more raw drugs through objectives.");
        return;
    }
    
    // For this mix, randomly choose 2 distinct types:
    let shuffled = availableTypes.sort(() => 0.5 - Math.random());
    const mixTypes = shuffled.slice(0,2);

    // Ensure required quantity for mixing is met (assume 1 unit of each is needed)
    if (player.resources[mixTypes[0]] < 1 || player.resources[mixTypes[1]] < 1) {
        updateEventLog("Not enough resources of one or more types to mix.");
        return;
    }
    
    // Deduct 1 unit from each type
    player.resources[mixTypes[0]]--;
    player.resources[mixTypes[1]]--;
    
    // Randomize effect on crafted drug:
    // Base potency is set as the sum of a base value plus a random bonus from 0 to 5.
    let basePotency = 10;
    let potencyBonus = Math.floor(Math.random() * 6);
    let finalPotency = basePotency + potencyBonus;
    
    // Randomize a suffix for the new strain, or let the player input a name
    let customName = document.getElementById('strain-name').value;
    if (!customName) {
        customName = prompt("Enter a name for your new drug strain:", "Hybrid Mix");
    }
    let craftedName = customName || "Hybrid Mix";
    
    // Apply random effects on NPCs and player:
    // Three possible outcomes: success, neutral, failure.
    let outcomeRand = Math.random();
    let npcEffect = 0, playerEffect = 0;
    if (outcomeRand < 0.33) {
        // Positive outcome
        npcEffect = 10; // improves faction reputation with Suppliers, for example
        playerEffect = 200; // bonus wealth reward from a brilliant mix
        updateEventLog("Mixing outcome: SUCCESS! Your blend is exceptional.");
    } else if (outcomeRand < 0.66) {
        // Neutral outcome
        npcEffect = 0;
        playerEffect = 0;
        updateEventLog("Mixing outcome: NEUTRAL. The product is average.");
    } else {
        // Negative outcome
        npcEffect = -10;
        playerEffect = -100; // you lose some wealth because the mix was subpar
        finalPotency = Math.max(5, finalPotency - 5); // reduce potency
        updateEventLog("Mixing outcome: FAILURE. The blend is poor quality.");
    }
    
    // Apply effects on player's stats:
    player.wealth += playerEffect;
    player.reputation += npcEffect;
    
    // Create the crafted product and add to inventory
    const newDrug = {
        name: craftedName,
        baseTypes: mixTypes,
        potency: finalPotency
    };
    player.inventory.craftedDrugs.push(newDrug);
    
    // Check if this is the first mix and reward an objective bonus
    if (!objectives.firstMix) {
        objectives.firstMix = true;
        // Reward: extra raw resource units (objective-based generation)
        player.resources.marijuana += 2;
        player.resources.cocaine += 1;
        updateEventLog("Objective complete: First successful mix! Bonus resources acquired.");
    }
    
    // Update all UI
    updateInventoryUI();
    updateResourceUI();
    updatePlayerStatsUI();
}

// ---- OBJECTIVE SYSTEM -----
// Here, resource generation from clicks is disabled; instead, rewards come from achieving objectives such as a successful mix.
// Additional objective functions can be added here.


// ---- NPC BEHAVIOR TREES ----
// Enhanced NPC interactions with three outcomes from each interaction
function npcInteract(name) {
    const npc = npcList.find(npc => npc.name === name);
    if (!npc) return;
    
    // Outcome: success, neutral, failure based on random roll and NPC type
    let outcome;
    let r = Math.random();
    if (npc.type === "Supplier") {
        // Suppliers are generally friendly
        outcome = (r < 0.6) ? "success" : (r < 0.85 ? "neutral" : "failure");
    } else if (npc.type === "Rival") {
        outcome = (r < 0.3) ? "success" : (r < 0.6 ? "neutral" : "failure");
    } else if (npc.type === "Cop") {
        outcome = (r < 0.4) ? "success" : (r < 0.7 ? "neutral" : "failure");
    } else {
        outcome = "neutral";
    }
    
    let message = `${npc.name} (${npc.type}) interaction: `;
    if (outcome === "success") {
        player.reputation += 10;
        player.wealth += 150;
        message += "SUCCESS! You benefit from a favorable deal.";
    } else if (outcome === "neutral") {
        message += "NEUTRAL outcome. No significant change.";
    } else {
        player.reputation -= 5;
        player.wealth = Math.max(0, player.wealth - 100);
        message += "FAILURE! The interaction cost you.";
    }
    
    updateEventLog(message);
}

// ---- COMBAT AND PICKPOCKETING WITH THREE OUTCOMES ----
function fight() {
    let r = Math.random();
    let outcome;
    if (r < 0.4) outcome = "success";
    else if (r < 0.7) outcome = "neutral";
    else outcome = "failure";
    
    let message = "Fight outcome: ";
    if (outcome === "success") {
        let gain = 200;
        player.wealth += gain;
        message += `SUCCESS! Gained $${gain}.`;
    } else if (outcome === "neutral") {
        message += "Neutral, no change.";
    } else {
        let loss = 150;
        player.wealth = Math.max(0, player.wealth - loss);
        message += `FAILURE! Lost $${loss}.`;
    }
    updateEventLog(message);
}

function pickpocket() {
    let r = Math.random();
    let outcome;
    if (r < 0.5) outcome = "success";
    else if (r < 0.8) outcome = "neutral";
    else outcome = "failure";
    
    let message = "Pickpocket outcome: ";
    if (outcome === "success") {
        let gain = 150;
        player.wealth += gain;
        message += `SUCCESS! Gained $${gain}.`;
    } else if (outcome === "neutral") {
        message += "Neutral, no effect.";
    } else {
        let loss = 75;
        player.wealth = Math.max(0, player.wealth - loss);
        message += `FAILURE! Lost $${loss}.`;
    }
    updateEventLog(message);
}

// ---- MARKET SIMULATION (Three Outcomes) ----
function triggerMarketEvent() {
    let r = Math.random();
    if (r < 0.33) {
        // Positive: Market boom
        market.marijuana += 5;
        market.cocaine += 5;
        market.lsd += 10;
        market.oxytocin += 5;
        updateEventLog("Market boom! Prices have risen.");
    } else if (r < 0.66) {
        updateEventLog("Market remains stable.");
    } else {
        // Negative: Market crash
        market.marijuana = Math.max(1, market.marijuana - 5);
        market.cocaine = Math.max(1, market.cocaine - 5);
        market.lsd = Math.max(1, market.lsd - 10);
        market.oxytocin = Math.max(1, market.oxytocin - 5);
        updateEventLog("Market crash! Prices have dropped.");
    }
    updateMarket();
}

// ---- TIME-BASED GAME LOOP ----
function simulateDay() {
    dayCounter++;
    updateEventLog(`Day ${dayCounter}: New day dawns...`);
    triggerMarketEvent();
    // Random NPC interaction event chance:
    if (Math.random() < 0.3) {
        const randNpc = npcList[Math.floor(Math.random() * npcList.length)];
        npcInteract(randNpc.name);
    }
}
setInterval(simulateDay, 20000); // Every 20 seconds, a new day is simulated.

// ---- SAVE & LOAD SYSTEM ----
function saveGame() {
    const gameState = { player, market, dayCounter, eventLog };
    localStorage.setItem("drugSimSave", JSON.stringify(gameState));
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
        updateMarket();
    } else {
        updateEventLog("No saved game found.");
    }
}

// ---- INITIALIZATION ----
function initializeGame() {
    // Initialize crafted inventory if not present
    if (!player.inventory.craftedDrugs) player.inventory.craftedDrugs = [];
    updateInventoryUI();
    updateResourceUI();
    updateMarket();
    updateEventLog("Game Started: Welcome to 45th Parallel. Build your empire!");
}
window.onload = initializeGame;
