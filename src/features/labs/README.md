# Lab feature modules live here.
# Each lab is a self-contained directory:
#
#   labs/
#     <lab-name>/
#       index.tsx        ← root component exported by the lab
#       manifest.ts      ← metadata (id, title, description, difficulty, tags)
#       components/      ← lab-specific UI
#       hooks/           ← lab-specific state / logic
#
# Register lab manifests in src/data/labManifests.ts so the router can discover them.
