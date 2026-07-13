(() => {
  const topBtn = document.getElementById("toTop");
  if (topBtn) {
    const onScroll = () => {
      topBtn.classList.toggle("show", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Remember open deep-dives in session
  document.querySelectorAll("details.deep").forEach((el, i) => {
    const key = `hf101-deep-${i}`;
    try {
      if (sessionStorage.getItem(key) === "1") el.open = true;
    } catch (_) {}
    el.addEventListener("toggle", () => {
      try {
        sessionStorage.setItem(key, el.open ? "1" : "0");
      } catch (_) {}
    });
  });
})();
