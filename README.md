# Pixel People Optimizer

This is a free open-source web app for making it easier to discover new professions to splice in Pixel People.
Feel free to contribute by putting up a pull request or by making a feature request by adding an issue!

What does this do?
- Store the profession/building/splice formula catalogue in Supabase
- Track your discoveries (buildings, professions)
- Recommend the next best profession(s) to splice based on available land and saved buildings/professions

## Installation

```bash
cd backend
pip install -e /path/to/pixel_people_optimizer
uvicorn pixel_people_optimizer.main:app
```

```bash
cd app
pnpm install
pnpm run dev
```
