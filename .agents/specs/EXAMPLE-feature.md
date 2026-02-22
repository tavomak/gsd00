# Feature: Team Member Bio Modal

**Status**: done
**Updated**: 2026-02-22

## What
Clicking a team member card opens a modal with the member's full biography, photo, and social links.

## Why
Users want to learn more about team members without navigating to a separate page.

## Requirements
- [ ] Clicking a `TeamCard` opens a `BioModal` overlay
- [ ] Modal displays: photo, name, title, full bio, LinkedIn URL
- [ ] Modal closes on backdrop click or Escape key
- [ ] URL does not change (no routing)

## Components Involved
- `TeamCard` (existing) — triggers modal open on click
- `BioModal` (new) — renders full bio content in an overlay

## Data / API
- GraphCMS query: `GET_TEAM_MEMBERS`
- Response shape: `{ name, title, bio, photo { url }, linkedIn }`

## Acceptance Criteria
- [ ] Modal renders all fields from GraphCMS
- [ ] Backdrop click and Escape key close the modal
- [ ] Focus is trapped inside modal while open
- [ ] Mobile layout stacks photo above text

## Notes
- Photo aspect ratio: 1:1, rendered at 200×200
- Bio text may contain newlines — render with `whitespace-pre-line`
- No animation required for initial version
