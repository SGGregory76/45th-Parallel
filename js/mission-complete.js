function checkMissionCompletion(npc) {
  const key = `mission_${npc.name}_completed`;
  if (localStorage.getItem(key) === "true") {
    npc.mission.status = "completed";
  }
}
