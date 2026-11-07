/*
 * palette.js — click-to-copy color palette renderer
 * -------------------------------------------------------------------------
 * How the pieces fit together:
 *
 *   palettes-data.js   defines window.PALETTE_DATA (the colors)
 *   index.qmd          places empty blocks such as <div data-palette="okabe-ito">
 *   palette.js (this)  finds those blocks and fills them with swatches
 *   palette.css        styles the result
 *
 * Two kinds of placeholders are recognized:
 *
 *   <div data-palette="ID">   -> one palette: swatches + "Copy all" buttons
 *   <div data-palette-format> -> the HEX / RGB / HSL switch (optional, once per page)
 *
 * No libraries are used. Everything is built with plain DOM APIs.
 */
(() => {
  "use strict";

  // ==== 1. Language ========================================================
  // Quarto writes the page language into <html lang="...">. The Japanese and
  // English builds share this file, so UI strings are picked here.
  const LANG = (document.documentElement.lang || "en").toLowerCase().startsWith("ja") ? "ja" : "en";
  const TEXT = {
    ja: {
      colors: (n) => `${n} 色`,
      categorical: "カテゴリ向け",
      sequential: "連続値向け",
      cvd: "色覚多様性に配慮",
      copied: "コピーしました",
      failed: "コピーできませんでした",
      copyOne: "コピー",
      copyAll: "まとめてコピー",
      formatLabel: "コピーする形式",
      source: "出典",
    },
    en: {
      colors: (n) => `${n} colors`,
      categorical: "Categorical",
      sequential: "Sequential",
      cvd: "Color-vision friendly",
      copied: "Copied",
      failed: "Copy failed",
      copyOne: "Copy",
      copyAll: "Copy all",
      formatLabel: "Copy format",
      source: "Source",
    },
  }[LANG];

  // ==== 2. Color helpers ===================================================
  // The data only stores HEX strings. Everything else is derived from them.

  // "#E69F00" -> [230, 159, 0]
  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  // sRGB channel (0-255) -> linear light (0-1), as defined by WCAG.
  const linear = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };

  // Relative luminance: 0 is black, 1 is white. Green counts most because the
  // eye is most sensitive to it.
  const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

  // Choose black or white text for a given background. WCAG's contrast ratio
  // between luminances L1 >= L2 is (L1 + 0.05) / (L2 + 0.05). We compute it
  // against black (L = 0) and white (L = 1) and take whichever is larger.
  const inkFor = (hex) => {
    const L = luminance(hexToRgb(hex));
    const vsBlack = (L + 0.05) / 0.05;
    const vsWhite = 1.05 / (L + 0.05);
    return vsBlack >= vsWhite ? "#0b0b0b" : "#ffffff";
  };

  // [r, g, b] (0-255) -> [hue 0-360, saturation %, lightness %]
  const toHsl = ([r8, g8, b8]) => {
    const r = r8 / 255, g = g8 / 255, b = b8 / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min; // chroma; 0 means a gray
    let h = 0, s = 0;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  };

  // "Okabe Ito" -> "okabe-ito" (used for CSS variable names)
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // ==== 3. What gets copied ================================================

  // (a) One color. The reader picks the format with the switch at the top.
  const FORMATS = {
    hex: (hex) => hex.toUpperCase(),
    rgb: (hex) => `rgb(${hexToRgb(hex).join(", ")})`,
    hsl: (hex) => {
      const [h, s, l] = toHsl(hexToRgb(hex));
      return `hsl(${h}, ${s}%, ${l}%)`;
    },
  };

  // (b) A whole palette. Always HEX, because R, Python and CSS all accept it.
  // The key is the button label; the function receives one palette object.
  const hexes = (p) => p.colors.map(([, hex]) => hex.toUpperCase());
  const BULK = {
    HEX: (p) => hexes(p).join(", "),
    R: (p) => `c(${hexes(p).map((h) => `"${h}"`).join(", ")})`,
    Python: (p) => `[${hexes(p).map((h) => `"${h}"`).join(", ")}]`,
    // Named colors become --palette-colorname; unnamed ones are numbered.
    CSS: (p) =>
      p.colors
        .map(([name, hex], i) => `--${p.id}-${name ? slug(name) : i + 1}: ${hex.toUpperCase()};`)
        .join("\n"),
    JSON: (p) => JSON.stringify(hexes(p)),
  };

  // ==== 4. Clipboard and feedback ==========================================

  // Returns true on success. The modern Clipboard API needs a secure context
  // (https or localhost), so we fall back to the old execCommand trick, which
  // also works when the page is opened from file://.
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // fall through to the legacy path
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0"; // keep it out of sight
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (_) {
      return false;
    }
  };

  // Screen-reader announcement. Sighted users see the "Copied" pill; this
  // hidden live region says the same thing out loud.
  let live;
  const announce = (msg) => {
    if (!live) {
      live = document.createElement("div");
      live.className = "visually-hidden"; // Bootstrap's screen-reader-only class
      live.setAttribute("role", "status");
      live.setAttribute("aria-live", "polite");
      document.body.appendChild(live);
    }
    live.textContent = "";
    // Set the text slightly later so an identical message is announced again.
    setTimeout(() => (live.textContent = msg), 50);
  };

  // One timer per element, so clicking twice quickly restarts the countdown
  // instead of clearing the feedback early.
  const timers = new WeakMap();
  const later = (node, ms, fn) => {
    clearTimeout(timers.get(node));
    timers.set(node, setTimeout(fn, ms));
  };

  // Show "Copied" on a swatch. CSS draws the pill from the classes below and
  // reads its text from the data-msg attribute (see palette.css).
  const flash = (node, ok, text) => {
    node.dataset.msg = ok ? TEXT.copied : TEXT.failed;
    node.classList.toggle("is-copied", ok);
    node.classList.toggle("is-failed", !ok);
    announce(`${ok ? TEXT.copied : TEXT.failed}: ${text}`);
    later(node, 1400, () => node.classList.remove("is-copied", "is-failed"));
  };

  // ==== 5. Single-color format state =======================================
  // The chosen format is remembered in localStorage as a small convenience.
  // Storage can be blocked (private windows, strict settings), so every access
  // is wrapped in try/catch and the page works without it.
  const STORE_KEY = "palette-copy-format";
  let format = "hex";
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && FORMATS[saved]) format = saved;
  } catch (_) {}

  // Every swatch registers here so a format change can relabel all of them.
  const swatches = []; // { btn, valueEl, hex, name }
  const formatButtons = [];

  // Update one swatch's visible value and its accessible name.
  const refreshSwatch = ({ btn, valueEl, hex, name }) => {
    const value = FORMATS[format](hex);
    valueEl.textContent = value;
    btn.setAttribute("aria-label", `${TEXT.copyOne}: ${name ? name + " " : ""}${value}`);
  };

  const setFormat = (next) => {
    format = next;
    try {
      localStorage.setItem(STORE_KEY, next);
    } catch (_) {}
    swatches.forEach(refreshSwatch);
    formatButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.format === next)));
  };

  // ==== 6. DOM builders ====================================================

  // Tiny helper: el("span", "palette-name", "Orange") -> <span class="palette-name">Orange</span>
  // textContent is used (never innerHTML), so data can't inject markup.
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  // One clickable color tile.
  const buildSwatch = ([name, hex]) => {
    const btn = el("button", "palette-swatch");
    btn.type = "button";
    // CSS reads these two custom properties for the background and text color.
    btn.style.setProperty("--sw-bg", hex);
    btn.style.setProperty("--sw-fg", inkFor(hex));
    if (name) btn.appendChild(el("span", "palette-name", name));
    const valueEl = el("span", "palette-value");
    btn.appendChild(valueEl);

    const item = { btn, valueEl, hex, name };
    swatches.push(item);
    refreshSwatch(item); // fills in the value text for the current format

    btn.addEventListener("click", async () => {
      const text = FORMATS[format](hex); // read the format at click time
      flash(btn, await copyText(text), text);
    });
    return btn;
  };

  // The line above the swatches: count, kind, color-vision note, source link.
  const buildMeta = (p) => {
    const meta = el("p", "palette-meta");
    meta.appendChild(el("span", null, TEXT.colors(p.colors.length)));
    meta.appendChild(el("span", "palette-chip", p.kind === "sequential" ? TEXT.sequential : TEXT.categorical));
    if (p.cvd) meta.appendChild(el("span", "palette-chip palette-chip-cvd", TEXT.cvd));
    if (p.source) {
      const a = el("a", null, `${TEXT.source}: ${p.source.label}`);
      a.href = p.source.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer"; // don't hand the new tab a reference to this one
      meta.appendChild(a);
    }
    return meta;
  };

  // The "Copy all: HEX R Python CSS JSON" row under a palette.
  const buildTools = (p) => {
    const tools = el("div", "palette-tools");
    tools.setAttribute("role", "group");
    tools.setAttribute("aria-label", TEXT.copyAll);
    tools.appendChild(el("span", "palette-tools-label", TEXT.copyAll));

    Object.entries(BULK).forEach(([label, make]) => {
      const b = el("button", "palette-btn", label);
      b.type = "button";
      b.addEventListener("click", async () => {
        const ok = await copyText(make(p));
        // Briefly swap the label for a check mark, then restore it.
        b.textContent = ok ? `✓ ${label}` : TEXT.failed;
        b.classList.toggle("is-copied", ok);
        announce(`${ok ? TEXT.copied : TEXT.failed}: ${label}`);
        later(b, 1400, () => {
          b.textContent = label;
          b.classList.remove("is-copied");
        });
      });
      tools.appendChild(b);
    });
    return tools;
  };

  // Fill one <div data-palette="ID"> placeholder.
  const renderPalette = (root) => {
    const p = (window.PALETTE_DATA || []).find((d) => d.id === root.dataset.palette);
    if (!p) {
      // A typo in the id should be obvious while writing, not fail silently.
      root.textContent = `Unknown palette: ${root.dataset.palette}`;
      return;
    }
    root.classList.add("palette");
    root.replaceChildren(buildMeta(p));

    // Sequential palettes get a smooth gradient strip above the discrete swatches.
    if (p.kind === "sequential") {
      const ribbon = el("div", "palette-ribbon");
      ribbon.setAttribute("aria-hidden", "true"); // decorative
      ribbon.style.background = `linear-gradient(to right, ${p.colors.map(([, h]) => h).join(", ")})`;
      root.appendChild(ribbon);
    }

    const grid = el("div", "palette-grid");
    p.colors.forEach((c) => grid.appendChild(buildSwatch(c)));
    root.append(grid, buildTools(p));
  };

  // Fill the <div data-palette-format> placeholder with the HEX/RGB/HSL switch.
  const renderFormatSwitch = (root) => {
    root.classList.add("palette-format");
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", TEXT.formatLabel);
    root.replaceChildren(el("span", "palette-tools-label", TEXT.formatLabel));

    const seg = el("div", "palette-seg");
    Object.keys(FORMATS).forEach((key) => {
      const b = el("button", "palette-seg-btn", key.toUpperCase());
      b.type = "button";
      b.dataset.format = key;
      // aria-pressed drives both the screen-reader state and the CSS highlight.
      b.setAttribute("aria-pressed", String(key === format));
      b.addEventListener("click", () => setFormat(key));
      formatButtons.push(b);
      seg.appendChild(b);
    });
    root.appendChild(seg);
  };

  // ==== 7. Entry point =====================================================
  // The format switch is built first so the saved format is already applied
  // when the swatches are created.
  const init = () => {
    document.querySelectorAll("[data-palette-format]").forEach(renderFormatSwitch);
    document.querySelectorAll("[data-palette]").forEach(renderPalette);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
