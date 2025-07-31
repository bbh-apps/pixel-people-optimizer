import argparse

from pixel_people_optimizer.db import SessionLocal, init_db
from pixel_people_optimizer.formulas.graph import build_graph_data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, help="Path to output JSON file")
    args = parser.parse_args()

    init_db()
    with SessionLocal() as s:
        data = build_graph_data(db=s)
        with open(args.output, "w") as f:
            f.write(data.model_dump_json(indent=2))
            return 0

    return 0


if __name__ == "__main__":
    main()
