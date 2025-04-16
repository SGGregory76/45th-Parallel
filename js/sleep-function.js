
// Add to global game engine

function sleep() {
  changeEnergy(100);

  const baseFinds = [
    "Crushed Pill (Low Value)",
    "Half-Smoked Joint",
    "Empty Baggie",
    "Pocket Change ($5)",
    "Old Burner Battery",
    null
  ];

  const midRepFinds = [
    "Used Vape Cart",
    "Random Dealer Number",
    "Small THC Gummy",
    "Blunt Wrap",
    null
  ];

  const highRepFinds = [
    "Rare Strain Sample",
    "NPC Favor Clue",
    "Mini Heat Map Device",
    "Dealer Discount Token",
    null
  ];

  let finds = baseFinds;
  if (gameData.rep >= 50 && gameData.rep < 100) {
    finds = finds.concat(midRepFinds);
  } else if (gameData.rep >= 100) {
    finds = finds.concat(midRepFinds, highRepFinds);
  }

  const found = finds[Math.floor(Math.random() * finds.length)];

  let message = "You rest in the car. Energy restored.";
  if (found) {
    if (found.includes("$")) {
      changeCash(5);
      message += ` You found ${found}.`;
    } else {
      addToInventory(found);
      message += ` You found: ${found}.`;
    }
  } else {
    message += " You found nothing this time.";
  }

  if (typeof document !== "undefined" && document.getElementById("log")) {
    document.getElementById("log").innerText = message;
  }

  updateUI();
}
