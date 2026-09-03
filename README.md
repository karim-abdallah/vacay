# vacay 🏖

A leave-management app: per-employee time-off policies, public holidays by country, booking days off, and balances on a calendar and dashboard.

Built May–December 2023 with Aliasgher Nooruddin. Not maintained; kept public as a work sample.

## What it does

- **Time-off policies** — PTO, public holidays and sick days, each with an accrual model (accruing, lump-sum, or unlimited), an annual allowance, an accrual cap, and a running balance tracked against a recorded date.
- **Holidays** — per-country public holiday sets that can be toggled per user.
- **Booking** — days off with a type and free-form tags, rendered on a team calendar.
- **HR data ingestion** — reads a company's workforce spreadsheet from Google Sheets via `gspread` and a GCP service account, validates the expected column headers, and writes results back to the sheet.
- **Auth** — email/password, plus Google and Facebook OAuth; JWT sessions.

## Where it was going

The plan was to grow this into French leave rules — *congés payés* on a June-to-May acquisition period, RTT accruing on separate terms, carry-over conditions, part-time proration interacting with all of it. That is meaningfully harder than the flat annual-allowance-and-cap model most tools ship, which is why it looked worth building.

It never got built. What's in this repo is the generic accrual model, and the French-specific work stayed a design note.

## Stack

- **Backend** — Django 3.1, Django REST Framework, SimpleJWT. Apps: `authentication` (users, companies, time-off and holiday settings, booked days), `dashboard` (settings APIs), `jarvishr` (Google Sheets + OpenAI HR data work).
- **Frontend** — React SPA built on a commercial admin template. The layout system, component library and theming are the template's; a fair number of its prebuilt pages are still in the tree unused.

```
myproject/     # Django backend
frontend/      # React SPA
```

## Running locally

```bash
# backend
cd myproject
cp .env.example .env        # fill in your own values
pip install -r requirements.txt
python manage.py makemigrations   # migrations are not tracked in this repo
python manage.py migrate
python manage.py runserver

# frontend
cd frontend
yarn install
yarn start
```

## Credentials

`.env.example` lists the required environment variables with empty values. Nothing in this repository contains working credentials.
