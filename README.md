# Pixel People Optimizer

A small, self-contained Python toolkit to:

- Scrape the Pixel People Fandom wiki
- Store the profession/building catalogue in SQLite
- Track your discoveries
- Recommend the next best profession(s) to splice based on available land

## Features

- Fast, local catalogue population
- CLI tools to log discoveries and buildings
- Smart recommendations for optimal splicing

## Requirements

- Python ≥ 3.12
- `requests`
- `beautifulsoup4`
- `sqlalchemy` (2.x)
- `pandas` (used by the scraper; optional if you prefer BS4-only)
- `rich` (optional, for pretty CLI output)

## Installation

Install locally in editable mode to make CLI scripts available on your `$PATH`:

```bash
pip install -e /path/to/pixel_people_optimizer
```

## Usage

### Populate the catalogue (first run: 2–3 s)

```bash
python -m pixel_people_optimizer.scrape
```

### Mark a building as constructed (e.g., Museum, id 23)

```bash
python -m pixel_people_optimizer.add_building 23
```

### Log a discovered profession (e.g., Historian, id 142)

```bash
python -m pixel_people_optimizer.add_profession 142
```

### Get recommendations for splicing (e.g., with 6 free land tiles)

```bash
python -m pixel_people_optimizer.recommend 6
```
