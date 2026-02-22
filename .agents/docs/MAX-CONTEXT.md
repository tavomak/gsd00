# MAX-CONTEXT RULE

## Limit
**Maximum**: 3,000 tokens (~12,000 characters) for all `.agents/docs/` files combined

## Enforcement
When adding content:
1. Measure total token count across all docs
2. If > 3,000 tokens:
   - Remove lowest-priority content (examples, verbose descriptions)
   - Compress remaining sections
   - Flag any file > 600 tokens (~20% of max) for mandatory compression

## Priority Order (Remove First)
1. Example prompts (example-prompts.md)
2. Code examples in troubleshooting/
3. Verbose descriptions
4. Redundant navigation structures
5. Repeated patterns

## Compression Checklist
- [ ] Use bullet points over prose
- [ ] Merge overlapping rules
- [ ] Remove explanatory preambles
- [ ] Use symbols (• → |) over words
- [ ] Eliminate filler ("In order to", "It is important")
- [ ] Prefer imperative ("Do X" not "You should do X")

## Never Remove
- Critical "never do" rules (App Router, TypeScript warnings)
- Core patterns (getStaticProps, ISR)
- GraphCMS query names
- Import paths (@/ alias)
- Component structure (Atomic Design)
