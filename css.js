body {
  font-family: Arial, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
  padding: 20px;
  margin: 0;
}

.game-container {
  max-width: 900px;
  margin: auto;
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.7);
}

.player-stats p {
  font-size: 18px;
  margin: 5px 0;
}

.inventory-panel, .resources-panel, .crafting-panel, .action-panel, .market-panel, .npc-panel, .log-panel {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #222;
  border-radius: 8px;
}

h2 {
  text-align: center;
}

button {
  background-color: #28a745;
  color: #fff;
  padding: 10px;
  margin: 5px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.inventory-item, .resource-item, .market-item, .npc-box, .log-entry {
  margin: 5px;
  padding: 5px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
}

input#create-strain-input, input#create-strain {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #555;
  margin-top: 5px;
}
