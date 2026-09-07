"""Run: python scripts/debug_zenml_import.py  (from project root, venv active)."""
import os
import sys
import traceback

_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_log = os.path.join(_root, "import_debug.log")

os.environ.setdefault("ZENML_ENABLE_RICH_TRACEBACK", "false")
os.environ.setdefault("ZENML_DISABLE_INTERACTIVE_INPUT", "true")
os.environ.setdefault(
    "ZENML_LOCAL_STORES_PATH",
    os.path.join(_root, ".zenml", "local_stores"),
)


def main() -> None:
    with open(_log, "w", encoding="utf-8") as f:
        f.write(f"exe={sys.executable}\n")
        f.write("importing zenml...\n")
        f.flush()
    try:
        import zenml  # noqa: F401

        msg = f"OK zenml version={zenml.__version__}\n"
    except BaseException:
        msg = "".join(traceback.format_exc())

    with open(_log, "a", encoding="utf-8") as f:
        f.write(msg)
    print(msg, file=sys.stderr)
    print(f"Wrote details to: {_log}", file=sys.stderr)


if __name__ == "__main__":
    main()
