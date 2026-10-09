# Simulation feature modules live here.
#
# Each simulation is a step-based state machine:
#
#   simulations/
#     <sim-name>/
#       index.tsx        ← root component
#       engine.ts        ← state machine / step evaluation logic
#       steps/           ← individual simulation steps
#       manifest.ts      ← metadata (id, title, description, category)
