# Project Rules

This repository is the company site plus the izakaya ordering demo template.

## Scope

- Company website: `/`
- Izakaya ordering demo: `/order/`, `/takeout/`, `/kitchen/`, `/checkout/`, `/admin/`
- Shared demo assets: `/assets/`
- Project documentation: `/docs/`
- Tests: `/tests/`

Do not use this repository for unrelated systems unless they are small demo pages that belong on the company site. Larger industry systems should stay in their own repositories and be linked from the company site.

## Development Rules

- Work only inside this project directory.
- Do not change OS, Git global config, proxy, credentials, or GitHub repository settings unless the user explicitly approves.
- Test locally before asking the user to review.
- Do not commit or push until the user says it is OK.
- Keep the demo reusable as a template, not a one-off customer build.

## Demo To Client Rule

The demo is the sales and template version. When a customer signs a contract:

1. Copy the demo into a customer-specific project.
2. Rename branding, URLs, store data, colors, and customer-specific settings.
3. Continue development in the customer project.
4. Keep this demo project clean for future sales.

## Suggested Project Names

- Demo: `demo-izakaya-ordering`
- Customer project: `client-{customer-name}-izakaya`
- Company site: `irakutech-company-site`

