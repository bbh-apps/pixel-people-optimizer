# backend/scrape.py

from __future__ import annotations

import re
import sys
from typing import Final

import pandas as pd
import requests
from bs4 import BeautifulSoup
from rich.progress import Progress
from sqlalchemy.orm import Session

from .db import SessionLocal, init_db
from .models import Building, Profession, SpliceFormula

URL_PROFESSIONS: Final = "https://pixelpeople.fandom.com/wiki/Professions"
URL_BUILDINGS: Final = "https://pixelpeople.fandom.com/wiki/List:Buildings"


def _table_from_wiki(url: str, table_index: int = 0) -> pd.DataFrame:
    html = requests.get(url, timeout=30).text
    tables = pd.read_html(html)
    return tables[table_index]


def scrape_buildings(session: Session) -> None:
    df = _table_from_wiki(URL_BUILDINGS)
    df.columns = df.columns.str.lower().str.strip().str.replace(" ", "_")

    print("🔍 Columns:", df.columns)

    for _, row in df.iterrows():
        name = row["building_name"]
        b = session.query(Building).filter_by(name=name).one_or_none()
        if not b:
            b = Building(name=name)
        b.land_size = int(row["lot_size"])
        b.multiplier = int(re.sub(r"[^0-9]", "", str(row.get("multiplier", 0))))
        b.coin_output = int(re.sub(r"[^0-9]", "", str(row.get("max_cps", 0))))
        session.add(b)
    session.commit()
    print("✅ Buildings saved.")


def scrape_professions(session: Session) -> None:
    professions_df = _table_from_wiki(URL_PROFESSIONS)
    special_genes_df = _table_from_wiki(URL_PROFESSIONS, table_index=1)

    professions_df.columns = (
        professions_df.columns.str.lower().str.strip().str.replace(" ", "_")
    )
    special_genes_df.columns = (
        special_genes_df.columns.str.lower().str.strip().str.replace(" ", "_")
    )

    buildings_by_name = {b.name: b for b in session.query(Building).all()}

    combined = pd.concat(
        [
            professions_df[["profession", "category"]],
            special_genes_df.rename(columns={"gene": "profession"})[
                ["profession"]
            ].assign(category="Special"),
        ]
    ).drop_duplicates()

    # Insert or update professions
    for _, row in combined.iterrows():
        profession: Profession | None = Profession(
            name=row["profession"], category=row["category"]
        )
        session.merge(profession)
    session.commit()

    all_professions = session.query(Profession).all()
    name_to_id = {p.name: p.id for p in all_professions}

    for _, row in professions_df.iterrows():
        profession_id = name_to_id.get(row["profession"])
        if profession_id is None:
            # Skip or raise error if you prefer
            continue

        building_names = [
            b.strip() for b in str(row["workplaces"]).split(",") if b.strip()
        ]
        linked_buildings = [
            buildings_by_name[b] for b in building_names if b in buildings_by_name
        ]

        profession = session.get(Profession, profession_id)
        if profession is None:
            raise ValueError(f"Profession with ID {profession_id} not found")

        profession.buildings = linked_buildings
        profession.unlock_bldg = (
            buildings_by_name.get(building_names[0]) if building_names else None
        )

        parent1_id = (
            name_to_id.get(row["formula_1"]) if pd.notna(row["formula_1"]) else None
        )
        parent2_id = (
            name_to_id.get(row["formula_2"]) if pd.notna(row["formula_2"]) else None
        )

        # Use merge if SpliceFormula may be new or detached
        session.merge(
            SpliceFormula(
                id=profession_id,
                parent1_id=parent1_id,
                parent2_id=parent2_id,
            )
        )

    for _, row in special_genes_df.iterrows():
        profession_id = name_to_id.get(row["gene"])
        if profession_id is not None:
            session.merge(
                SpliceFormula(id=profession_id, parent1_id=None, parent2_id=None)
            )

    session.commit()
    print("✅ Professions and formulas saved.")


def main() -> int:
    init_db()
    with SessionLocal() as session, Progress() as progress:
        t1 = progress.add_task("Scraping buildings", total=1)
        scrape_buildings(session)
        progress.update(t1, advance=1)

        t2 = progress.add_task("Scraping professions", total=1)
        scrape_professions(session)
        progress.update(t2, advance=1)

    print("✅ Catalogue refreshed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
