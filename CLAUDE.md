# CLAUDE.md

## Project

DesignLoop is a Next.js/React application for practicing low-level
design (LLD) with AI-assisted feedback.

Product: - Name: DesignLoop - Default title:
`DesignLoop | Master Low-Level Design with AI` - Title template:
`%s | DesignLoop` - Description:
`Solve real-world low-level design problems, master design patterns, and get instant feedback from your AI design assistant.`

Core user flow: 1. Choose an LLD problem. 2. Design the solution with
classes, relationships, and patterns. 3. Submit the design. 4. Review AI
feedback on SOLID, coupling, cohesion, patterns, scalability, and
trade-offs.

## Stack

Use the existing stack; inspect `package.json` before introducing or
assuming dependencies.

Expected stack: - Next.js - React - TypeScript - Tailwind CSS -
shadcn/ui - Hugeicons - drizzle-orm - Postgres

Use the repository's existing package manager and scripts. Do not add a
new dependency when the existing stack can solve the task.

## Commands

First inspect `package.json` and use its actual scripts.

Typical commands:

```bash
bun run dev
bun run build
bun run lint
bun run type-check
bun run format
```

Before completing a meaningful code change, run:

```bash
bun run lint
bun run type-check
```

Run the production build when changing routing, configuration, metadata,
dependencies, or build-sensitive code.

## Architecture

Inspect existing code before creating new abstractions.

Prefer: - `app/` for routes, layouts, metadata, and page composition. -
`components/` for reusable and feature UI. - `components/ui/` for shadcn
primitives. - `lib/` for shared utilities. - `hooks/` for reusable
client behavior. - `public/` for static assets.

Keep feature-specific components near their feature. Do not create a
file or abstraction unless it improves reuse, clarity, or testability.

Prefer server components by default. Add `"use client"` only when state,
effects, browser APIs, event handlers, or client-only libraries require
it.

## Hard Rules

- Use TypeScript; do not introduce `any` without a specific
  justification.
- Do not use `@ts-ignore` or disable lint rules to hide errors.
- Reuse existing components and utilities before creating duplicates.
- Use shadcn/ui primitives for standard UI behavior.
- Use Hugeicons for interface icons; do not introduce another icon
  library without a concrete reason.
- Use semantic Tailwind tokens such as `bg-background`, `bg-card`,
  `text-foreground`, `text-muted-foreground`, `border-border`, and
  `text-primary`.
- Avoid hard-coded colors when an existing theme token represents the
  same intent.
- Preserve existing APIs and behavior unless the task requires a
  breaking change.
- Inspect usages before changing a shared component.
- Do not modify generated files, lockfiles manually, vendor code, or
  unrelated files.
- Never expose secrets, API keys, database credentials, or private
  tokens to client code.
- Do not perform destructive production operations without explicit
  human approval.
- Do not treat AI feedback as authoritative; present design feedback
  as analysis with clear reasoning and trade-offs.

## UI Rules

Build mobile-first and verify narrow, tablet, and desktop layouts.

Prefer composition over deeply nested conditional markup.

Use semantic HTML: - `<button>` for actions. - `<a>`/Next.js `Link` for
navigation. - `<ol>`/`<ul>` for lists. - Headings for section hierarchy.

Every interactive element must be keyboard accessible and have a visible
focus state. Icon-only controls require an accessible name. Decorative
icons and graphics should use `aria-hidden="true"`.

Keep animations subtle and purposeful. Prefer CSS transitions/animations
over JavaScript animation loops. Respect `prefers-reduced-motion`.

For conditional Tailwind classes, use the project's `cn()` utility.

## LLD Conventions

Model domain responsibilities explicitly.

Prefer focused objects such as:

```text
BasicScenarioBasedLLD
ParkingLot
ParkingSpot
Vehicle
Ticket
Payment
PricingStrategy
SpotAllocationStrategy
```

Use interfaces, composition, and design patterns when they solve a real
extensibility or responsibility problem.

Do not add patterns merely to demonstrate patterns. Avoid god classes
and mixed responsibilities.

When showing AI critique, make feedback actionable and identify: -
responsibility boundaries - coupling/cohesion - SOLID violations -
pattern fit - extensibility - scalability - trade-offs

## Workflow

For non-trivial tasks:

1.  Inspect relevant files and existing conventions.
2.  Identify the smallest change that satisfies the request.
3.  Reuse existing components/utilities where possible.
4.  Implement the change.
5.  Run lint and type checking.
6.  Test the relevant behavior and responsive states.
7.  Review the diff and remove unrelated changes.

Ask before proceeding when missing information materially changes
architecture, data behavior, or a destructive action.

If two approaches are reasonable, briefly state the trade-off and choose
the one that best matches the existing codebase.

## Out of Scope

Do not modify: - generated/build output - dependency lockfiles
manually - third-party/vendor code - production infrastructure -
unrelated features

Do not turn this file into general documentation. Put detailed design
decisions in ADRs/docs and path-specific instructions in
`.claude/rules/` when the project grows.

## Human Approval Required

Stop and ask for explicit approval before: - destructive database/schema
changes - deleting production data - authentication/authorization
changes - IAM/RBAC policy changes - billing/payment logic changes -
disabling monitoring, logging, or security controls - rotating/revoking
production credentials - production deployment when not explicitly
requested

When asking, state what will change, why it is needed, and what could be
affected.

## Definition of Done

A task is done when: - requested behavior works - existing conventions
are preserved - responsive and accessible states are handled - no
unnecessary dependency was added - lint passes - TypeScript passes -
relevant tests/build checks pass - the final diff contains only
task-related changes
