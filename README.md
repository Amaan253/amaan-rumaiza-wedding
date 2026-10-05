# Amaan Ali Khan & Rumaiza Khan — Wedding Invitation

A single-page wedding invitation website. It is plain HTML, CSS and JavaScript, with no build step.

```
index.html              all text: names, parents, events, venue, footer
css/style.css           colours, fonts, layout, animations
js/main.js              intro doors, scroll reveals, scratch card, countdown
assets/favicon.svg      browser-tab icon
assets/images/          hero background, couple illustrations, link-preview image
```

## Preview on your computer

Double-click `index.html` to open it in Chrome or Safari. The Google Fonts and the map need an internet connection.

## Editing details

| What | Where |
|------|-------|
| Names, parents, event descriptions, dates, times, venues | `index.html`: sections `#couple`, `#events`, `#save-the-date`, `#countdown`, `#families` and `#venue` |
| "Get Directions" links | the `href` of each `event-card__cta` link in `index.html` |
| Embedded map | the `<iframe>` inside `#venue` in `index.html` |
| Countdown target | `weddingDate` near the top of `js/main.js` (currently `2026-11-12T18:00:00+05:30`, i.e. Baraat at 6 PM IST) |

> **Please confirm before sharing.** No times were provided, so these are placeholders:
>
> - Haldi: "After lunch" (`index.html` line 151)
> - Baraat: "6:00 PM Onwards" (lines 168, 213 and 281, plus the countdown in `js/main.js` line 9)
> - Reception: "7:00 PM Onwards" (line 185)
>
> The footer note on line 307 ("…refrain from bringing any gifts") comes from the template wording, so change or remove it if it doesn't suit you.

## Couple illustrations

| File | Used in |
|------|---------|
| `assets/images/couple-haldi.webp` | Haldi card |
| `assets/images/couple-baraat.webp` | Baraat card |
| `assets/images/couple-reception.webp` | Reception card |
| `assets/images/couple-hero.svg` | top section, beside the names card (still a placeholder) |
| `assets/images/couple-wedding.webp` | not used yet: the red wedding-outfit illustration |

To use `couple-wedding.webp` in the top section, change `couple-hero.svg` to `couple-wedding.webp` in `index.html` line 84, and set that tag's `width="1024" height="1280"`.

To swap an illustration, replace the file and keep the same name. The current ones are 1024 × 1280 px WebP with transparent backgrounds. Images of the same shape sit exactly as these do, filling the coloured area at the top of each card.

## Link preview (WhatsApp / Facebook)

`assets/images/og-image.jpg` (1200 × 630) is the image shown when the link is shared. Once the site is live, open `index.html` and change

```html
<meta property="og:image" content="assets/images/og-image.jpg">
```

to the full address, for example `https://YOUR-SITE.netlify.app/assets/images/og-image.jpg`. WhatsApp only shows images that use full URLs.

## Putting it online

Use a **personal** account. Don't use a work or company account.

- **Netlify Drop (easiest, no tools needed):** go to <https://app.netlify.com/drop>, sign in, and drag this whole folder onto the page. You get a live `https://….netlify.app` link straight away. You can rename it under *Site configuration → Change site name*.
- **GitHub Pages:** push this folder to a public repository on your personal GitHub account. Then go to *Settings → Pages → Deploy from branch → `main` / root*.
- **Vercel:** run `npx vercel` from this folder, or import the repository at <https://vercel.com/new>.

To update the live site later, for example after adding the couple images, upload or push the folder again.
