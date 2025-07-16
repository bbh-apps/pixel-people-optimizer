"""CLI helper: python -m pixel_people_optimizer.add_profession <profession_id>"""

import argparse
import sys

from rich import print

from .db import Session, init_db
from .models import MyProfession, Profession


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Log newly constructed profession(s)")
    parser.add_argument(
        "profession_ids", type=int, nargs="+", help="ID(s) from the catalogue"
    )
    args = parser.parse_args(argv)

    init_db()
    with Session() as s:
        for pid in args.profession_ids:
            if not s.get(Profession, pid):
                print(f"[red]Profession id {pid} not found. Run the scraper first.[/]")
                continue
            if s.query(MyProfession).filter_by(profession_id=pid).first():
                print("[yellow]You already logged this profession.[/]")
                continue
            s.add(MyProfession(profession_id=pid))
            print(f"[green]Profession {pid} saved!")
        s.commit()


if __name__ == "__main__":
    sys.exit(main())
