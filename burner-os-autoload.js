<!-- Burner OS Phone UI with Blogger Page Link Loader -->
<div style="max-width:300px;margin:30px auto;padding:15px;border:2px solid #444;border-radius:20px;background:#1b1b1b;color:#fff;font-family:'Segoe UI',sans-serif;">
  <div style="text-align:center;font-weight:bold;font-size:18px;margin-bottom:15px;">Burner OS</div>

  <!-- Grid Icons -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:15px;text-align:center;">
    <a href="/p/missions.html" data-load-inside style="background:#222;padding:10px;border-radius:12px;cursor:pointer;display:block;color:white;text-decoration:none;">📋<div style="font-size:12px;color:#ccc;">Missions</div></a>
    <a href="/p/contacts.html" data-load-inside style="background:#222;padding:10px;border-radius:12px;cursor:pointer;display:block;color:white;text-decoration:none;">👤<div style="font-size:12px;color:#ccc;">Contacts</div></a>
    <a href="/p/inventory.html" data-load-inside style="background:#222;padding:10px;border-radius:12px;cursor:pointer;display:block;color:white;text-decoration:none;">🎒<div style="font-size:12px;color:#ccc;">Inventory</div></a>
    <a href="/p/craft.html" data-load-inside style="background:#222;padding:10px;border-radius:12px;cursor:pointer;display:block;color:white;text-decoration:none;">⚗️<div style="font-size:12px;color:#ccc;">Craft</div></a>
    <a href="/p/map.html" data-load-inside style="background:#222;padding:10px;border-radius:12px;cursor:pointer;display:block;color:white;text-decoration:none;">🗺️<div style="font-size:12px;color:#ccc;">Map</div></a>
    <a href="/p/log.html" data-load-inside style="background:#222;padding:10px;border-radius:12px;cursor:pointer;display:block;color:white;text-decoration:none;">🧾<div style="font-size:12px;color:#ccc;">Log</div></a>
  </div>

  <!-- Dynamic Page Loader -->
  <div id="appWindow" style="background:#000;border:1px solid #333;border-radius:10px;padding:10px;min-height:280px;">
    <p>Select an app to begin.</p>
  </div>
</div>

<script>
// Blogger Page Link Loader for Burner OS
function interceptLinks() {
  document.querySelectorAll("a[data-load-inside]").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = e.target.closest("a").getAttribute("href");
      if (!target) return;
      fetch(target)
        .then(res => res.text())
        .then(html => {
          const temp = document.createElement("div");
          temp.innerHTML = html;
          const content = temp.querySelector(".post-body, .content, main") || temp;
          document.getElementById("appWindow").innerHTML = content.innerHTML;
        })
        .catch(err => {
          document.getElementById("appWindow").innerHTML = "<p>Failed to load content.</p>";
          console.error("Error loading page:", err);
        });
    });
  });
}

// Activate listener after page load
window.addEventListener("load", () => {
  interceptLinks();
  setTimeout(interceptLinks, 2000); // ensure Blogger-injected links get caught
});
</script>
