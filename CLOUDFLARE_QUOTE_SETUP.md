# Cloudflare quote email setup

The quote form uses a Cloudflare Pages Function at `/api/quote`. The function sends a plain-text email through Cloudflare's native Email Service binding named `QUOTE_EMAIL`; the destination is fixed server-side as `info@heavytraillogistics.com`.

## Required account configuration

1. Confirm that Cloudflare Email Service is available for the account and enable it for the site if prompted.
2. Verify `heavytraillogistics.com` as an allowed sending domain in Cloudflare Email Service.
3. Add the DNS records Cloudflare provides for email authentication, including SPF/DKIM where requested. Preserve existing mail records used by the business.
4. In the Pages project settings, configure the Email Service binding named `QUOTE_EMAIL` with destination `info@heavytraillogistics.com`. The checked-in `wrangler.toml` documents the same binding for Wrangler-compatible deployments.
5. Deploy this feature branch to a non-production Preview deployment first. Do not change the production `main` deployment until preview email delivery has been tested.

No API key, password, or other secret is required by this implementation. The binding is managed by Cloudflare and is never exposed to the browser.

## Testing after configuration

Submit a real quote from the Pages Preview URL and verify that `info@heavytraillogistics.com` receives the complete request. Confirm that Reply is addressed to the submitted customer email. Also test an incomplete form, a deliberately failed or unavailable binding, and a honeypot submission; these must not show the success dialog.

Real email delivery has not been tested locally or through Cloudflare in this repository change.