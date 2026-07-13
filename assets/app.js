(() => {
  const I18N = window.HF101_I18N || { en: {}, "zh-TW": {} };
  const STORAGE_KEY = "hf101-lang";

  const detectLang = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh-TW") return saved;
    } catch (_) {}
    const nav = (navigator.language || "en").toLowerCase();
    if (nav.startsWith("zh")) return "zh-TW";
    return "en";
  };

  let current = detectLang();

  const apply = (lang) => {
    current = lang;
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang === "zh-TW" ? "zh-Hant-TW" : "en";
    document.body.dataset.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if (val == null) return;
      el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = dict[key];
      if (val == null) return;
      el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const val = dict[key];
      if (val == null) return;
      el.setAttribute("aria-label", val);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      const val = dict[key];
      if (val == null) return;
      el.setAttribute("alt", val);
    });

    // document title + meta description
    if (dict["meta.title"]) document.title = dict["meta.title"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.desc"]) metaDesc.setAttribute("content", dict["meta.desc"]);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && dict["meta.title"]) ogTitle.setAttribute("content", dict["meta.title"]);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && dict["meta.desc"]) ogDesc.setAttribute("content", dict["meta.desc"]);

    // toggle buttons
    document.querySelectorAll("[data-lang-set]").forEach((btn) => {
      const active = btn.getAttribute("data-lang-set") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  };

  // Language switcher
  document.querySelectorAll("[data-lang-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang-set");
      if (lang) apply(lang);
    });
  });

  apply(current);

  // Back to top
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
