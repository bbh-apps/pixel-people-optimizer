"""Scraper that populates the catalogue tables. Run as a module."""

from __future__ import annotations

import re
import sys
from typing import Final

import pandas as pd
import requests
from bs4 import BeautifulSoup
from rich.progress import Progress

from .db import Session, init_db
from .models import Building, Profession, SpliceFormula

URL_PROFESSIONS: Final = "https://pixelpeople.fandom.com/wiki/Professions"
URL_BUILDINGS: Final = "https://pixelpeople.fandom.com/wiki/List:Buildings"


# Helper -----------------------------------------------------


def _table_from_wiki(url: str, table_index: int = 0) -> pd.DataFrame:
    """Return the nth HTML table on a wiki page as a DataFrame."""
    html = requests.get(url, timeout=30).text
    tables = pd.read_html(html)
    return tables[table_index]


# -------------------------------------------------------------------------


def scrape_buildings(session: Session) -> None:
    df = _table_from_wiki(URL_BUILDINGS)
    # Expect columns like: Name, Lot size, Multiplier, Coin output, …
    df.columns = [c.lower().strip().replace(" ", "_") for c in df.columns]
    print(df.columns)

    with Session() as session:
        for _, row in df.iterrows():
            b = (
                session.query(Building)
                .filter_by(name=row["building_name"])
                .one_or_none()
            )
            if not b:
                b = Building(name=row["building_name"])
            b.land_size = int(row["lot_size"])  # 3×3 → 3
            b.multiplier = int(re.sub(r"[^0-9]", "", str(row.get("multiplier", 0))))
            b.coin_output = int(re.sub(r"[^0-9]", "", str(row.get("max_cps", 0))))
            session.add(b)
        session.commit()
    print("Buildings saved.")


def scrape_professions(session: Session) -> None:
    professions_df = _table_from_wiki(URL_PROFESSIONS)
    special_genes_df = _table_from_wiki(URL_PROFESSIONS, table_index=1)
    professions_df.columns = [
        c.lower().strip().replace(" ", "_") for c in professions_df.columns
    ]
    special_genes_df.columns = [
        c.lower().strip().replace(" ", "_") for c in special_genes_df.columns
    ]

    # Map building names to IDs for FK
    b_lookup = {b.name: b.id for b in session.query(Building).all()}

    with Session() as session:
        buildings_by_name = {b.name: b for b in session.query(Building).all()}

        name_to_id = {}

        # Insert all professions (normal and special)
        combined = pd.concat(
            [
                professions_df[["profession", "category"]],
                special_genes_df.rename(columns={"gene": "profession"})[
                    ["profession"]
                ].assign(category="Special"),
            ]
        ).drop_duplicates()

        for _, row in combined.iterrows():
            profession = Profession(
                name=row["profession"],
                category=row["category"],
            )
            session.merge(profession)
        session.commit()

        # Refresh ID mapping
        all_professions = session.query(Profession).all()
        name_to_id = {p.name: p.id for p in all_professions}

        # Link buildings and formulas (only for main professions table)
        for _, row in professions_df.iterrows():
            profession_id = name_to_id.get(row["profession"])
            building_names = [
                b.strip() for b in str(row["workplaces"]).split(",") if b.strip()
            ]
            linked_buildings = [
                buildings_by_name[b] for b in building_names if b in buildings_by_name
            ]

            unlock_bldg = (
                buildings_by_name[building_names[0]].id
                if building_names and building_names[0] in buildings_by_name
                else None
            )

            profession = session.query(Profession).get(profession_id)
            profession.buildings = linked_buildings
            profession.unlock_bldg = unlock_bldg

            parent1_id = (
                name_to_id.get(row["formula_1"]) if pd.notna(row["formula_1"]) else None
            )
            parent2_id = (
                name_to_id.get(row["formula_2"]) if pd.notna(row["formula_2"]) else None
            )

            session.merge(
                SpliceFormula(
                    id=profession_id,
                    parent1_id=parent1_id,
                    parent2_id=parent2_id,
                )
            )

        # Add splice entries for special genes with no parents
        for _, row in special_genes_df.iterrows():
            profession_id = name_to_id.get(row["gene"])
            if profession_id is not None:
                session.merge(
                    SpliceFormula(
                        id=profession_id,
                        parent1_id=None,
                        parent2_id=None,
                    )
                )

        session.commit()
    print("✅ Professions and formulas saved.")


# -------------------------------------------------------------------------


def main() -> None:
    init_db()
    with Session() as s, Progress() as progress:
        t1 = progress.add_task("Scraping buildings", total=1)
        scrape_buildings(s)
        progress.update(t1, advance=1)

        t2 = progress.add_task("Scraping professions", total=1)
        scrape_professions(s)
        progress.update(t2, advance=1)

    print("✅ Catalogue refreshed.")


if __name__ == "__main__":
    sys.exit(main())
