# Security Policy

## Supported Versions

Security fixes are applied to the latest published release of `rappi-cli` on npm. Older versions may not receive backports.

## Reporting a Vulnerability

Please report security issues privately:

1. Prefer **GitHub private vulnerability reporting** on the repository (Security → Report a vulnerability), if that feature is enabled for the maintainers.
2. Otherwise open a **maintainer-directed issue** that does **not** include exploit details in public comments; ask maintainers for a private channel and share a clear description, impact, and reproduction steps there.

We do **not** operate a paid bug bounty. Responsible disclosure is appreciated; please allow reasonable time for triage before public discussion.

## Scope notes

- Auth tokens and delivery coordinates live in `.rappi-config.json` (gitignored). Never commit that file or paste tokens into issues/PRs.
- The HTTP API (`rappi server`) is intended for local use. Treat binding it on untrusted networks as out of scope for this policy stub.
- Dependency advisories: run `bun run audit` after install. Some transitive findings may remain when overrides or peer ranges conflict; see the PR history for residual-risk notes.
