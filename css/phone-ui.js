<div class="phone-ui">
  <div class="phone-header">Burner OS</div>
  <div class="app-grid">
    <div class="app-icon" onclick="openApp('missions')">
      <span class="icon">📋</span>
      <span class="label">Missions</span>
    </div>
    <div class="app-icon" onclick="openApp('contacts')">
      <span class="icon">👤</span>
      <span class="label">Contacts</span>
    </div>
    <div class="app-icon" onclick="openApp('inventory')">
      <span class="icon">🎒</span>
      <span class="label">Inventory</span>
    </div>
    <div class="app-icon" onclick="openApp('map')">
      <span class="icon">🗺️</span>
      <span class="label">Map</span>
    </div>
    <div class="app-icon" onclick="openApp('log')">
      <span class="icon">🧾</span>
      <span class="label">Log</span>
    </div>
    <div class="app-icon" onclick="openApp('settings')">
      <span class="icon">⚙️</span>
      <span class="label">Settings</span>
    </div>
  </div>
  <div id="appWindow" class="app-window">
    <div id="missionContent">
      <h4>Missions</h4>
      <p>Choose a contact to begin.</p>
      <select id="npcSelect" onchange="renderNPC(this.value)">
        <option value="0">Rico (Enforcer)</option>
        <option value="1">Maya (Courier)</option>
        <option value="2">Lex (Chemist)</option>
      </select>
      <div id="npcMissions"></div>
    </div>
  </div>
</div>

<style>
  body {
    background: #0a0a0a;
    font-family: 'Segoe UI', sans-serif;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
  }
  .phone-ui {
    width: 320px;
    background: #1b1b1b;
    border: 2px solid #444;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 255, 150, 0.2);
  }
  .phone-header {
    background: #111;
    padding: 12px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #444;
    letter-spacing: 1px;
  }
  .app-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 15px;
  }
  .app-icon {
    background: #292929;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 10px;
    text-align: center;
    transition: background 0.3s;
    cursor: pointer;
  }
  .app-icon:hover {
    background: #3f3f3f;
  }
  .icon {
    font-size: 24px;
    display: block;
    margin-bottom: 5px;
  }
  .label {
    font-size: 12px;
    color: #ccc;
  }
  .app-window {
    border-top: 1px solid #444;
    padding: 12px;
    background: #101010;
    min-height: 180px;
  }
</style>

<script>
  const npcs = [
    {
      name: "Rico",
      trustLevel: "Trusted",
      missions: [
        { title: "Protect Turf", status: "available", reward: 500, xp: 10 },
        { title: "Intercept Deal", status: "locked", reward: 800, xp: 15, unlockAt: 75 }
      ]
    },
    {
      name: "Maya",
      trustLevel: "Neutral",
      missions: [
        { title: "Run Microdrop to Club", status: "available", reward: 300, xp: 7 },
        { title: "Double Route", status: "locked", reward: 550, xp: 12, unlockAt: 60 }
      ]
    },
    {
      name: "Lex",
      trustLevel: "Loyal",
      missions: [
        { title: "Test Synth Sample", status: "available", reward: 400, xp: 8 },
        { title: "Formula Refinement", status: "locked", reward: 600, xp: 14, unlockAt: 80 }
      ]
    }
  ];

  function openApp(app) {
    const appWindow = document.getElementById('appWindow');
    if (app === 'missions') {
      document.getElementById('missionContent').style.display = 'block';
    } else {
      document.getElementById('missionContent').style.display = 'none';
      appWindow.innerHTML = `<p>Loading <strong>${app}</strong>...</p>`;
    }
  }

  function renderNPC(index) {
    const npc = npcs[index];
    const missionDiv = document.getElementById('npcMissions');
    let html = `<h5>${npc.name} (${npc.trustLevel})</h5>`;
    npc.missions.forEach(m => {
      if (m.status === 'locked') {
        html += `<p><strong>${m.title}</strong> (Locked)</p>`;
      } else {
        html += `<p><strong>${m.title}</strong><br>Reward: $${m.reward}, XP: ${m.xp}<br><button>Complete</button></p>`;
      }
    });
    missionDiv.innerHTML = html;
  }

  renderNPC(0);
</script>
