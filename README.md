# TNEA Cutoff Scraper

Scrapes TNEA 2024 cutoff data and displays it in a React web app.

## What it does

Automatically scrapes all 174 pages of TNEA cutoff marks from the official website and shows them in a clean table interface. Extracts 3,474 records covering all colleges and engineering branches.

## Tech Stack

- **Scraper:** Python, Selenium, BeautifulSoup
- **Frontend:** React, TypeScript, Vite

## Setup

### Prerequisites

- Python 3.13+, Node.js 22, Firefox

### Install

```bash
# Python dependencies
pip install -r requirements.txt

# React dependencies
npm install


```

## Usage

### 1. Scrape Data

Run `scraper/new.ipynb` in Jupyter Notebook:

- Opens Firefox and navigates to TNEA website
- Handles reCAPTCHA automatically
- Scrapes all 174 pages (~15-20 minutes)
- Saves data to `tnea_data.csv` and `tnea_data.json`

### 2. View Data

```bash
npm run dev
```

Visit `http://localhost:5173` to see the data table.

## Data Structure

Each record contains college info, branch details, and cutoff marks for 9 categories (OC, BC, BCM, MBC, MBCDNC, MBCV, SC, SCA, ST).

## Files

```
├── scraper/new.ipynb          # Scraping code
├── src/App.tsx                # React app
├── src/assets/tnea_data.ts    # Scraped data
└── src/hooks/useTable.ts      #hook
```

## How Scraping Works

1. Opens browser and navigates to cutoff site
2. Clicks reCAPTCHA checkbox
3. Loops through all 174 pages
4. Extracts table data with BeautifulSoup
5. Exports to CSV/JSON

## Notes

- Scraper includes 5-second delays between pages
- May need manual reCAPTCHA solving occasionally
- Data is publicly available TNEA 2024 cutoffs
- Educational use only

## License

MIT
