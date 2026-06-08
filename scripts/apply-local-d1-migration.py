from pathlib import Path
import sqlite3


DB_DIR = Path(".void/v3/d1/miniflare-D1DatabaseObject")
MIGRATION = Path("db/migrations/20260605000100_create_messages.sql")


def main() -> None:
    db_files = [
        path
        for path in DB_DIR.glob("*.sqlite")
        if not path.name.startswith("metadata")
    ]

    if len(db_files) != 1:
        raise SystemExit(f"Expected one local D1 sqlite file, found {len(db_files)}")

    sql = MIGRATION.read_text(encoding="utf-8").replace(
        "CREATE TABLE `messages`",
        "CREATE TABLE IF NOT EXISTS `messages`",
    )

    with sqlite3.connect(db_files[0]) as connection:
        connection.executescript(sql)

    print(f"Applied {MIGRATION} to {db_files[0]}")


if __name__ == "__main__":
    main()
