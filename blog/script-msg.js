<script>
function logMessage(type, text) {
  const log = document.getElementById("message-log");
  const entry = document.createElement("div");
  entry.classList.add("msg-entry", type);
  entry.innerText = text;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight; // auto-scroll
}

// Example usage:
logMessage('incoming', 'Yo, you still got that eighth?');
logMessage('outgoing', 'Yeah. Meet me on 6th.');
logMessage('system', 'Inventory updated.');
</script>
