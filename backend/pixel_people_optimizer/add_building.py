"""CLI helper: python -m pixel_people_optimizer.add_building <building_id ...>"""

import argparse
import sys

from rich import print

from .db import SessionLocal, init_db
from .models import Building, MyBuilding


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Log newly constructed building(s)")
    parser.add_argument(
        "building_ids", type=int, nargs="+", help="ID(s) from the catalogue"
    )
    args = parser.parse_args(argv)

    init_db()
    with SessionLocal() as s:
        for bid in args.building_ids:
            if not s.get(Building, bid):
                print(f"[red]Building id {bid} not found. Run the scraper first.[/]")
                continue
            if s.query(MyBuilding).filter_by(building_id=bid).first():
                print(f"[yellow]Building id {bid} already logged.[/]")
                continue
            s.add(MyBuilding(building_id=bid))
            print(f"[green]Building id {bid} saved.[/]")
        s.commit()
    return 0


if __name__ == "__main__":
    sys.exit(main())
