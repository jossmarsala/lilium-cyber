# Scenario feature modules live here.
#
# Each scenario defines objectives and validator functions:
#
#   scenarios/
#     <scenario-name>/
#       index.tsx        ← root component
#       schema.ts        ← ordered list of objectives (id, description, validatorKey)
#       validators/      ← one file per validator function
#       manifest.ts      ← metadata (id, title, description, difficulty)
