#!/usr/bin/env python3
import sys, json, datetime

def main():
    if len(sys.argv) < 2:
        print("Usage: pick_version_by_age.py YYYY-MM-DD")
        sys.exit(2)
    cutoff = datetime.date.fromisoformat(sys.argv[1])
    try:
        data = json.load(sys.stdin)
    except Exception as e:
        print("Error: failed to read JSON from stdin:", e, file=sys.stderr)
        sys.exit(3)

    # data is mapping version -> iso-datetime string, plus created/modified keys
    versions = []
    for k, v in data.items():
        if k in ("created", "modified"):
            continue
        try:
            date = datetime.date.fromisoformat(v[:10])
            versions.append((k, date))
        except Exception:
            continue

    valid = [v for v in versions if v[1] <= cutoff]
    if not valid:
        print("")  # no acceptable version
        return
    # sort by date then by semver-like fallback (string)
    valid.sort(key=lambda x: (x[1], x[0]))
    print(valid[-1][0])

if __name__ == "__main__":
    main()
