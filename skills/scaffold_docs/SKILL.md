# SKILL: scaffold_docs (LifeLink)

## Purpose
Keep `docs/` consistent with the **LifeLink** brand and the **Links/Story/Self** taxonomy.

## When to use
- Renaming, repositioning, or reorganizing docs
- Updating requirements/specs from source materials
- Preparing “Codex-ready” context before coding

## Inputs
- `docs/20_spec/source/ETERNAL_LINK_SPECIFICATION.md`
- `docs/10_requirements/requirements_appendix.pdf` (Nexia requirements)
- `docs/20_spec/lifelink_mindmap.md`
- `docs/00_concept/lifelink_concept.md`

## Output targets
- `docs/10_requirements/requirements_core.md`
- `docs/20_spec/lifelink_spec.md`
- `docs/30_roadmap/roadmap.md`

## Procedure (repeatable)
1. Read `docs/00_concept/lifelink_concept.md` first and keep taxonomy.
2. Summarize changes needed in a short plan.
3. Update `requirements_core.md` with any new/clarified requirements.
4. Update `lifelink_spec.md`:
   - Keep technical accuracy from the source spec.
   - Reframe headings and intro to LifeLink branding.
5. Update roadmap if scope changes.
6. Run a quick consistency check:
   - Terminology: LifeLink, Links/Story/Self
   - No leftover “Eternal Link / Nexia” except inside `source/` or explicit historical notes.
