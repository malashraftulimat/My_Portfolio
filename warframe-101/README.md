# Warframe 101

An unofficial, spoiler-light interactive beginner's guide to Warframe.
Available in English / Japanese / Arabic / Turkish / Korean, with a
Warframe/Orokin-inspired UI. When embedded in the portfolio, its language
follows the portfolio's master header switcher.

## Structure

```
index.html        Page markup
styles.css        All styling (theme, layout, Orokin/Tenno accents)
app.js            Content data + widgets (planets, mods, relics, quiz, …)
i18n.js           Generated translation dictionary (en -> ja/ar/tr/ko)
language.js       Runtime language renderer (swaps text from i18n.js)
strings.tsv       Merged translation file (columns: en <tab> ja <tab> ar <tab> tr <tab> ko)
img/              All site images (.webp)
fonts/            tennobet.ttf (Tenno script font)
scripts/          Build / translation tooling (not shipped to the browser)
```

Only `index.html`, `styles.css`, `app.js`, `i18n.js`, `language.js`, `img/` and
`fonts/` are needed to run the site.

## Editing content

Most text lives in `app.js` (data arrays) and `index.html`. After editing,
regenerate the translations from the project root:

```sh
node scripts/i18n_build.js      # extract strings -> scripts/i18n_src.json
node scripts/i18n_fill.js       # translate missing entries -> i18n.js
node scripts/strings_build.js   # regenerate strings.tsv
```

Everything in `scripts/` expects to be run from the project root.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/i18n_build.js` | Extract translatable strings from `index.html` + `app.js` |
| `scripts/i18n_fill.js` | Fill missing ja/ar/tr/ko entries in `i18n.js` (Google Translate) |
| `scripts/strings_build.js` | Dump the dictionary into `strings.tsv` (one row per string) |
| `scripts/strings_import.js` | Import an edited `strings.tsv` back into `i18n.js` |
| `scripts/i18n_translate.js` | Full re-translation of the dictionary from scratch |
| `scripts/extract.js` | Dump translatable strings from `index.html` (audit helper) |

## Credits

Game content and images are the property of Digital Extremes. Facts summarized
from the community Warframe Wiki.
