/*
 * palettes-data.js — the colors shown in this post
 * -------------------------------------------------------------------------
 * This file is data only. palette.js reads it and draws the swatches.
 *
 * To add a palette:
 *   1. Append an object to the array below.
 *   2. In index.qmd, place an empty block where it should appear:
 *        ::: {data-palette="your-id"}
 *        :::
 *
 * Fields of each palette object:
 *   id      Unique name. Matches data-palette in index.qmd, and prefixes the
 *           variable names produced by the "CSS" copy button.
 *   kind    "categorical": distinct colors for groups (legends, bars, lines).
 *           "sequential":  ordered colors for low-to-high values. These also
 *                          get a smooth gradient strip above the swatches.
 *   cvd     true if the palette was designed for color vision diversity.
 *           Shows a "color-vision friendly" chip. Leave false when unsure.
 *   source  { label, url } for the credit link. Optional.
 *   colors  List of [name, hex] pairs, in display order. Use 6-digit hex
 *           ("#E69F00"). Use null as the name for unnamed colors; they are
 *           numbered in the CSS output instead.
 *
 * Names are English on purpose: they are shared by the Japanese and English
 * pages, and they double as CSS variable names (--okabe-ito-sky-blue).
 */
window.PALETTE_DATA = [
  {
    id: "okabe-ito",
    kind: "categorical",
    cvd: true,
    source: { label: "Okabe & Ito (2008)", url: "https://jfly.uni-koeln.de/color/" },
    colors: [
      ["Black", "#000000"],
      ["Orange", "#E69F00"],
      ["Sky blue", "#56B4E9"],
      ["Bluish green", "#009E73"],
      ["Yellow", "#F0E442"],
      ["Blue", "#0072B2"],
      ["Vermillion", "#D55E00"],
      ["Reddish purple", "#CC79A7"],
    ],
  },
  {
    id: "tol-bright",
    kind: "categorical",
    cvd: true,
    source: { label: "Paul Tol", url: "https://sronpersonalpages.nl/~pault/" },
    colors: [
      ["Blue", "#4477AA"],
      ["Cyan", "#66CCEE"],
      ["Green", "#228833"],
      ["Yellow", "#CCBB44"],
      ["Red", "#EE6677"],
      ["Purple", "#AA3377"],
      ["Grey", "#BBBBBB"],
    ],
  },
  {
    id: "tol-vibrant",
    kind: "categorical",
    cvd: true,
    source: { label: "Paul Tol", url: "https://sronpersonalpages.nl/~pault/" },
    colors: [
      ["Orange", "#EE7733"],
      ["Blue", "#0077BB"],
      ["Cyan", "#33BBEE"],
      ["Magenta", "#EE3377"],
      ["Red", "#CC3311"],
      ["Teal", "#009988"],
      ["Grey", "#BBBBBB"],
    ],
  },
  {
    id: "tol-muted",
    kind: "categorical",
    cvd: true,
    source: { label: "Paul Tol", url: "https://sronpersonalpages.nl/~pault/" },
    colors: [
      ["Rose", "#CC6677"],
      ["Indigo", "#332288"],
      ["Sand", "#DDCC77"],
      ["Green", "#117733"],
      ["Cyan", "#88CCEE"],
      ["Wine", "#882255"],
      ["Teal", "#44AA99"],
      ["Olive", "#999933"],
      ["Purple", "#AA4499"],
      ["Pale grey", "#DDDDDD"],
    ],
  },
  {
    id: "viridis",
    kind: "sequential",
    cvd: true,
    source: { label: "viridis", url: "https://sjmgarnier.github.io/viridisLite/" },
    colors: [
      [null, "#440154"],
      [null, "#46337E"],
      [null, "#365C8D"],
      [null, "#277F8E"],
      [null, "#1FA187"],
      [null, "#4AC16D"],
      [null, "#9FDA3A"],
      [null, "#FDE725"],
    ],
  },
  {
    id: "tableau-10",
    kind: "categorical",
    cvd: false,
    source: { label: "Tableau", url: "https://www.tableau.com/blog/colors-upgrade-tableau-10-56782" },
    colors: [
      ["Blue", "#4E79A7"],
      ["Orange", "#F28E2B"],
      ["Red", "#E15759"],
      ["Teal", "#76B7B2"],
      ["Green", "#59A14F"],
      ["Yellow", "#EDC948"],
      ["Purple", "#B07AA1"],
      ["Pink", "#FF9DA7"],
      ["Brown", "#9C755F"],
      ["Grey", "#BAB0AC"],
    ],
  },
  {
    id: "flexoki-600",
    kind: "categorical",
    cvd: false,
    source: { label: "Flexoki", url: "https://stephango.com/flexoki" },
    colors: [
      ["Red", "#AF3029"],
      ["Orange", "#BC5215"],
      ["Yellow", "#AD8301"],
      ["Green", "#66800B"],
      ["Cyan", "#24837B"],
      ["Blue", "#205EA6"],
      ["Purple", "#5E409D"],
      ["Magenta", "#A02F6F"],
    ],
  },
  {
    id: "flexoki-400",
    kind: "categorical",
    cvd: false,
    source: { label: "Flexoki", url: "https://stephango.com/flexoki" },
    colors: [
      ["Red", "#D14D41"],
      ["Orange", "#DA702C"],
      ["Yellow", "#D0A215"],
      ["Green", "#879A39"],
      ["Cyan", "#3AA99F"],
      ["Blue", "#4385BE"],
      ["Purple", "#8B7EC8"],
      ["Magenta", "#CE5D97"],
    ],
  },
];
