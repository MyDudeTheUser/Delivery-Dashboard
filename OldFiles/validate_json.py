#!/usr/bin/env python3
import json
import sys
from pathlib import Path

try:
    from jsonschema import validate, ValidationError, SchemaError
except ImportError:
    validate = None
    ValidationError = Exception
    SchemaError = Exception


def parse_json(path: Path):
    try:
        text = path.read_text(encoding='utf-8')
        data = json.loads(text)
        print(f"✅ Parsed OK: {path}")
        return data
    except json.JSONDecodeError as e:
        print(f"❌ JSON syntax error in {path}: {e.msg} (line {e.lineno}, column {e.colno})")
        lines = text.splitlines()
        if 1 <= e.lineno <= len(lines):
            bad_line = lines[e.lineno - 1]
            pointer = ' ' * (e.colno - 1) + '^'
            print(f"> {bad_line}")
            print(f"  {pointer}")
        sys.exit(2)
    except FileNotFoundError:
        print(f"❌ File not found: {path}")
        sys.exit(1)


def schema_validate(data, schema_path: Path):
    if validate is None:
        print("⚠️ jsonschema not installed. Skipping schema validation. Run: python -m pip install jsonschema")
        return
    schema = parse_json(schema_path)
    try:
        validate(instance=data, schema=schema)
        print(f"✅ Schema validation passed against {schema_path}")
    except ValidationError as e:
        print(f"❌ Schema validation error: {e.message}")
        if hasattr(e, 'absolute_path'):
            print("Path to failing element:", list(e.absolute_path))
        sys.exit(4)
    except SchemaError as e:
        print(f"❌ Schema is invalid: {e}")
        sys.exit(5)


def main():
    data = parse_json(Path("../JSON_Prompt.json"))
    schema_validate(data, Path("../schema.json"))

if __name__ == '__main__':
    main()