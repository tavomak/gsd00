# Documentation Maintenance

## How to Update

1. **active-context.md** - Update when starting/completing significant work
2. **tech-stack.md** - Update when adding/removing dependencies
3. **environment.md** - Update when adding new env vars
4. **api-patterns.md** - Update when adding new GraphCMS queries
5. **components.md** - Update when adding new components

## Specs (.agents/specs/)
- Create a spec BEFORE implementing any new feature or component
- Copy the relevant template (TEMPLATE-FEATURE.md or TEMPLATE-COMPONENT.md)
- Name the file: `feature-name.md` or `ComponentName.md`
- Update status field as work progresses (draft → approved → in-progress → done)

## Rules

- Keep files concise and scannable
- Use code blocks for structured data
- Include code examples for patterns
- Update timestamps in active-context.md

## Quality Check

Before committing:

- Run `pnpm lint` to verify no errors
- Check all links are valid
- Verify code examples are correct
