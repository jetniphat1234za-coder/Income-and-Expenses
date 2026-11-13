# 💰 JNP Wealth Tracker

🌐 **English** | [ภาษาไทย](README.th.md)

A personal finance web app for tracking **income, expenses, and an investment portfolio** in one dashboard.
Built with plain HTML, CSS, and JavaScript — no build step, no backend, no sign-up.

All data is stored in **your browser (localStorage)** and never leaves your device (except live price lookups, see below).

> Note: the interface is in Thai.

## ✨ Features

| Tab | Details |
|-----|---------|
| 📊 **Dashboard** | Monthly summary of income, expenses, and balance; monthly comparison chart; expense-by-category chart; recent transactions; mini portfolio overview |
| 🧾 **Income & Expenses** | Add, edit, and delete transactions with categories; paginated table; filter by month |
| 📈 **Portfolio** | Track stocks, ETFs, and gold with shares, cost, and current price; profit/loss in THB; add/edit assets; **live price sync** for US stocks, gold, and the USD/THB exchange rate |
| 🗂️ **Data Management** | Import from an Excel (`.xlsx`) file; export/import a full backup as JSON |

Other details:
- Supports both THB and USD assets (converted using the USD/THB rate)
- Charts powered by Chart.js
- Starts with sample data so you can explore right away

## 🛠️ Tech Stack

- HTML5, CSS3, vanilla JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) — charts
- [SheetJS (xlsx)](https://sheetjs.com/) — Excel import
- Google Fonts: Outfit & Noto Sans Thai
- Browser `localStorage` for persistence

## 🚀 Getting Started

No installation needed.

```bash
# 1. Clone the repository
git clone https://github.com/jetniphat1234za-coder/Income-and-Expenses.git
cd Income-and-Expenses
```

Then simply open `index.html` in your browser. Or serve it locally:

```bash
python -m http.server 8000
```

and visit <http://localhost:8000>.

> An internet connection is needed for Chart.js, SheetJS, Google Fonts (loaded from CDN), and live price sync.

## 📥 Excel Import

On the **Data Management** tab, upload an `.xlsx` file. The importer looks for these sheets by name:

- a sheet whose name contains `สรุปข้อมูลรายเดือน` (monthly summary) → income and expense transactions
- a sheet whose name contains `สรุปข้อมูลการออม` (savings + investment summary) → portfolio assets

## 💾 Backup & Restore

Use **Download backup (.json)** on the Data Management tab to export everything, and the import button to restore it.
Clearing your browser data erases the app's data, so back up regularly.

## 📁 Project Structure

```
Income-and-Expenses/
├── index.html        # Page layout and tabs
├── style.css         # Styling
├── app.js            # App state, rendering, charts, portfolio, storage
└── xlsx_helper.js    # Excel (.xlsx) parser
```

## ⚠️ Notes & Limitations

- Live prices are fetched from a public Yahoo Finance endpoint directly from the browser; this may be blocked by CORS or rate limits, in which case the last saved prices are used.
- The bundled sample data and portfolio are examples; replace or delete them with your own data.
- Data is per browser/device — use the JSON backup to move between devices.

## 📄 License

Not specified yet.
