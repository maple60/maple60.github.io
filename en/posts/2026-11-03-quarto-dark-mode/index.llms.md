# Adding Dark Mode and a Theme Toggle to a Quarto Website

quarto

website

css

Add a dark theme and a built-in toggle while preserving an existing light theme, including notes for multilingual Quarto sites.

Published

2026-11-03

Modified

2026-11-03

[日本語版](../../../posts/2026-11-03-quarto-dark-mode/)

This site now supports dark mode. Use the appearance icon in the navigation bar to switch between light and dark themes. This post describes how to add the feature while preserving an existing light palette.

## Use Quarto’s built-in toggle

Defining both `light` and `dark` HTML themes makes Quarto generate a toggle automatically. On websites, it appears in the navigation bar. No custom button or JavaScript is needed. See the official [Dark Mode documentation](https://quarto.org/docs/output-formats/html-themes.html#dark-mode).

The shared `_quarto.yml` now contains:

``` yaml
format:
  html:
    theme:
      light: [default, custom.scss]
      dark: [darkly, custom-dark.scss]
    respect-user-color-scheme: true
```

The light variant retains the existing cream background. The dark variant combines the built-in `darkly` theme with a separate customization file.

`respect-user-color-scheme: true` honors the reader’s OS or browser preference on the initial visit. Quarto also handles saving and restoring manual choices; persistence may be unavailable when browser storage is restricted. This option requires Quarto 1.7 or later and JavaScript. With JavaScript disabled, the first theme (light here) is used.

## Keep the palettes separate

The existing `custom.scss` sets a light background explicitly. Loading it into the dark variant would override that variant’s background. Instead, `custom-dark.scss` contains:

``` scss
/*-- scss:defaults --*/
$body-bg: #1c1b1a;
$body-color: #e6e4dc;
$navbar-bg: #282726;
$footer-bg: #282726;
$link-color: #8dc8f8;
$code-color: #e9b4d0;

/*-- scss:rules --*/
.language-switch {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

body.quarto-dark {
  color-scheme: dark;
}
```

Sass variables in `scss:defaults` feed into Bootstrap styling. They cover the page, navigation, footer, links, and inline code. Regular CSS belongs in `scss:rules`. The language link keeps the same spacing in both modes, while `color-scheme` informs browser-provided controls of the dark palette.

Quarto adds `.quarto-light` or `.quarto-dark` to the document body. These classes can scope further adjustments.

## Share the setting across languages

The shared `_quarto.yml` supplies the theme configuration to both language profiles. Language-specific settings live in `_quarto-ja.yml` and `_quarto-en.yml`.

This site explicitly lists English render targets, so the new article also needs an entry in `project.render` in `_quarto-en.yml`. Its Japanese and English sections follow the existing profile-based content structure.

## Render and check

``` bash
quarto render
quarto render --profile en
```

Japanese output goes to `_site`, and English output goes to `_site/en`. Render English last because a full Japanese render recreates the parent output directory.

Check the toggle, persistence after reloading or navigating, system preferences with no saved choice, readable tables and code, and operation on narrow screens.

Images and external embeds may retain their own colors. A figure with a white background may need a separate adjustment or a mode-specific version.

## References

- [HTML Theming — Quarto](https://quarto.org/docs/output-formats/html-themes.html#dark-mode)
- [Website Tools — Quarto](https://quarto.org/docs/websites/website-tools.html#dark-mode)
