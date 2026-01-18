(function () {
  const ALLOWED = new Set(["/", "/index.html", "/404.html"]);
  const path = window.location.pathname || "/";
  const hasHash = window.location.hash && window.location.hash.length > 0;

  if (!ALLOWED.has(path) && !hasHash) {
    fetch("/404.html", { cache: "no-store" })
      .then((r) => r.text())
      .then((html) => {
        document.open();
        document.write(html);
        document.close();
      });
  }
})();
