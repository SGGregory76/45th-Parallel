<div class="npc-profile">
  <h3>NPC Profile</h3>
  <div class="player-stats">
    <strong>Wealth:</strong> $<span id="playerWealth">1000</span> | 
    <strong>XP:</strong> <span id="playerXP">0</span>
  </div>

  <select id="npcSelect">
    <option value="0">Rico (Enforcer)</option>
    <option value="1">Maya (Courier)</option>
    <option value="2">Lex (Chemist)</option>
  </select>

  <div id="npcDetails" class="npc-details">
    <p><strong>Name:</strong> <span id="npcName"></span></p>
    <p><strong>Archetype:</strong> <span id="npcArchetype"></span></p>
    <p><strong>Loyalty:</strong> <span id="npcLoyalty"></span></p>
    <p><strong>Trust Level:</strong> <span id="npcTrust"></span></p>
    <p><strong>Status:</strong> <span id="npcStatus"></span></p>
  </div>

  <div id="npcMission"></div>
  <div id="npcMessages"></div>

  <div class="npc-actions">
    <button onclick="adjustLoyalty(5)">Complete Deal (+5)</button>
    <button onclick="adjustLoyalty(-10)">Fail Mission (-10)</button>
    <button onclick="adjustLoyalty(-25)">Betray NPC (-25)</button>
  </div>
</div>

<style>
  .npc-profile {
    background: #111;
    color: #0f0;
    padding: 15px;
    border: 1px solid #0f0;
    border-radius: 10px;
    max-width: 350px;
    font-family: monospace;
    margin: 20px auto;
  }
  .npc-details p {
    margin: 6px 0;
  }
  .player-stats {
    margin-bottom: 10px;
  }
  #npcMission, #npcMessages {
    margin: 10px 0;
    padding: 8px;
    background: #000;
    border: 1px solid #0f0;
    border-radius: 6px;
  }
  select {
    width: 100%;
    padding: 5px;
    background: #222;
    color: #0f0;
    border: 1px solid #0f0;
    margin-bottom: 15px;
  }
  .npc-actions button {
    margin: 5px 5px 0 0;
    padding: 6px 12px;
    background: #222;
    color: #0f0;
    border: 1px solid #0f0;
    border-radius: 5px;
    cursor: pointer;
  }
  .npc-actions button:hover {
    background: #0f0;
    color: #000;
  }
</style>

<script>
  const player = {
    wealth: 1000,
    xp: 0
  };

  const npcs = [
    {
      name: "Rico",
      archetype: "Enforcer",
      loyalty: 65,
      betrayalFlag: false,
      missions: [
        { id: "1", title: "Protect Turf", status: "available", reward: 500, xp: 10 },
        { id: "2", title: "Intercept Deal", status: "locked", reward: 800, xp: 15, unlockAt: 75 }
      ],
      messages: ["I need muscle on 3rd Street.", "You handle this clean, we talk real business."]
    },
    {
      name: "Maya",
      archetype: "Courier",
      loyalty: 48,
      betrayalFlag: false,
      missions: [
        { id: "1", title: "Run Microdrop to Club", status: "available", reward: 300, xp: 7 },
        { id: "2", title: "Double Route Courier Run", status: "locked", reward: 550, xp: 12, unlockAt: 60 }
      ],
      messages: ["Got a quick job, no questions.", "Don't open the bag."]
    },
    {
      name: "Lex",
      archetype: "Chemist",
      loyalty: 78,
      betrayalFlag: false,
      missions: [
        { id: "1", title: "Test Synth Sample", status: "available", reward: 400, xp: 8 },
        { id: "2", title: "Formula Refinement", status: "locked", reward: 600, xp: 14, unlockAt: 80 }
      ],
      messages: ["New formula ready.", "Need someone I can trust."]
    }
  ];

  let currentNPCIndex = 0;

  // Daily reset
  const today = new Date().toLocaleDateString();
  if (localStorage.getItem("last_reset") !== today) {
    npcs.forEach(npc => {
      npc.missions.forEach(m => localStorage.removeItem(`mission_${npc.name}_${m.id}_completed`));
    });
    localStorage.setItem("last_reset", today);
  }

  function updateTrustLevel(npc) {
    const l = npc.loyalty;
    npc.trustLevel = l >= 75 ? "Loyal" :
                     l >= 50 ? "Trusted" :
                     l >= 25 ? "Neutral" : "Distrustful";
    if (npc.loyalty <= 15) npc.betrayalFlag = true;
  }

  function renderNPC(index) {
    const npc = npcs[index];
    currentNPCIndex = index;
    updateTrustLevel(npc);

    document.getElementById("npcName").textContent = npc.name;
    document.getElementById("npcArchetype").textContent = npc.archetype;
    document.getElementById("npcLoyalty").textContent = npc.loyalty;
    document.getElementById("npcTrust").textContent = npc.trustLevel;
    document.getElementById("npcStatus").textContent = npc.betrayalFlag ? "Unstable / May Betray" : "✔ OK to deal";
    document.getElementById("playerWealth").textContent = player.wealth;
    document.getElementById("playerXP").textContent = player.xp;

    const missionEl = document.getElementById("npcMission");
    missionEl.innerHTML = npc.missions.map(m => {
      const key = `mission_${npc.name}_${m.id}_completed`;
      const completed = localStorage.getItem(key) === "true";
      const unlocked = !m.unlockAt || npc.loyalty >= m.unlockAt;

      if (!unlocked) {
        return `<p><strong>${m.title}</strong> (Locked - Loyalty ${m.unlockAt})</p>`;
      } else if (completed) {
        return `<p><strong>${m.title}</strong> - <em>Completed</em></p>`;
      } else {
        return `
          <p><strong>Mission:</strong> ${m.title}<br>
          Reward: $${m.reward} & ${m.xp} XP<br>
          <button onclick="completeMission('${npc.name}', '${m.id}', ${m.reward}, ${m.xp})">Complete Mission</button></p>
        `;
      }
    }).join('');

    const msgEl = document.getElementById("npcMessages");
    msgEl.innerHTML = npc.messages.map(m => `<div>> ${m}</div>`).join('');
  }

  function completeMission(npcName, missionId, reward, xpGain) {
    const key = `mission_${npcName}_${missionId}_completed`;
    localStorage.setItem(key, "true");
    const npc = npcs[currentNPCIndex];
    npc.loyalty += 10;
    player.wealth += reward;
    player.xp += xpGain;
    renderNPC(currentNPCIndex);
  }

  function adjustLoyalty(amount) {
    const npc = npcs[currentNPCIndex];
    npc.loyalty = Math.max(0, Math.min(100, npc.loyalty + amount));
    renderNPC(currentNPCIndex);
  }

  document.getElementById("npcSelect").addEventListener("change", (e) => {
    renderNPC(e.target.value);
  });

  renderNPC(0);
</script>
