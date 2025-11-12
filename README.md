# AgriValue Exchange

Web application built with React + Vite for FEDF-PS01: “Support the farmers to produce value-added agricultural products for promoting rural entrepreneurship.”

## Features

- **Landing & impact storytelling** for global buyers and partners.
- **Authentication** with seeded roles: admin, farmers, buyers. New users can self-register.
- **Admin dashboard** to manage users, approve products, and oversee orders.
- **Farmer dashboard** for publishing value-added SKUs, editing inventory, and tracking buyer demand.
- **Buyer marketplace** with filters, quote requests, order management, and feedback submissions.
- **Insights, Resources, and Stories** pages supplying intelligence, playbooks, and success stories.
- **Persistent state** via context + localStorage; preloaded demo data for immediate exploration.

## Getting Started

```bash
npm install
npm run dev    # starts Vite dev server
npm run build  # production build
```

## Seeded Credentials

- Admin: `2400030791@kluniversity.in / bhargav`
- Farmer: `2400080026@kluniversity.in / farmer123`
- Buyer: `2300031957@kluniversity.in / buyer123`

Additional sample accounts are available in `src/context/AppContext.jsx`.

## Tech Stack

- React 18 + Vite
- React Router
- Context API with reducer pattern
- Modern responsive UI (Inter font, custom design system)
