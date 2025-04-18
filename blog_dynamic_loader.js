function interceptLinks() {
  document.querySelectorAll("a[data-load-inside]").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = e.target.getAttribute("href");
      if (!target) return;
      fetch(target)
        .then(res => res.text())
        .then(html => {
          const temp = document.createElement("div");
          temp.innerHTML = html;
          const mainContent = temp.querySelector(".post-body, .content, main") || temp;
          document.getElementById("appWindow").innerHTML = mainContent.innerHTML;
        })
        .catch(err => {
          document.getElementById("appWindow").innerHTML = "<p>Failed to load content.</p>";
          console.error("Error loading content:", err);
        });
    });
  });
}

// Run on load and after delay (Blogger can be slow)
window.addEventListener("load", () => {
  interceptLinks();
  setTimeout(interceptLinks, 2000);
});