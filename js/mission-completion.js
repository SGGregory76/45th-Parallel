function completeMission() {
  const npc = npcs[currentNPCIndex];
  if (npc.mission && npc.mission.status === "available") {
    npc.mission.status = "completed";
    npc.loyalty += 10;
    player.wealth += npc.mission.reward;
    player.xp += npc.mission.xp;

    // Save completion state
    localStorage.setItem(`mission_${npc.name}_completed`, "true");

    renderNPC(currentNPCIndex);
  }
}
