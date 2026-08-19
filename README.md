# Heavy Trail Logistics Website

A lightweight static website for a trucking and logistics company, built with plain HTML, CSS, and minimal vanilla JavaScript.

## Project structure

- `index.html` — homepage content and all company information
- `assets/css/styles.css` — site styling and responsive layout
- `assets/js/main.js` — mobile navigation and frontend quote form behavior
- `assets/images/` — trucking-related illustrations for the homepage

## Run locally

Open `index.html` directly in a browser, or run a simple local server from the project folder:

```bash
cd /path/to/LogisticsSite
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Update business information

Edit the values in `index.html` to change the following:

- Phone numbers
- Address
- Email address
- Services
- USDOT / MC numbers
- Company description
- Contact information
- Driver hiring information

### Common places to update

- Header and homepage text: `index.html`
- Service cards: `index.html` inside the services section
- Contact details: `index.html` in the Contact section
- Quote form fields: `index.html` in the Request a Quote section
- Driver recruitment content: `index.html` in the Drive With Us section
- Footer email and contact links: `index.html`

## Update photos

Replace the SVG files in `assets/images/` with new truck or logistics artwork as needed.

## Cloudflare deployment notes

This site is designed to remain static and simple for deployment through Cloudflare Pages or a static hosting bucket.

- No build step is required
- No database or backend is required
- The quote form is frontend-only and can later be connected to a real submission service
- Keep all business content in `index.html` for easy handoff to another developer

## Design notes

- The site is intentionally static and easy to maintain.
- No framework or build step is required.
- The quote form is frontend-only for now and can be connected to a real form service later.
