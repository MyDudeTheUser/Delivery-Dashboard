# Code Review Guidelines

This document outlines the expectations and best practices for conducting code reviews in the Delivery Dashboard repository. The primary goals of our code review process are to ensure high code quality, catch bugs and edge cases before they reach production, foster knowledge sharing across the team, and enforce our architectural standards.

## Expectations for the Author

Authors should strive to keep Pull Requests small and focused. If a feature is exceptionally large, it should be broken down into smaller, independently reviewable chunks. When opening a PR, the author must provide adequate context by thoroughly filling out the `PULL_REQUEST_TEMPLATE.md`, focusing on explaining _why_ a change was made rather than just _what_ was changed.

Before requesting a review from peers, authors are expected to perform a self-review of their own code diff to catch typos, leftover debug statements, and obvious logical flaws. Furthermore, a review should not be requested until all automated GitHub Actions—including linting, testing, and building—have successfully passed.

## Expectations for the Reviewer

Reviewers play a critical role in maintaining the health of the repository. A thorough review should encompass several distinct areas of focus:

**Architectural and Logical Integrity**
The reviewer must verify that the code successfully meets the requirements of the associated issue or ticket. The logic should be sound, with all potential edge cases handled gracefully. React components should remain small and focused on a single responsibility. Additionally, state management must be evaluated to ensure that server state utilizes React Query, while UI state relies on local component state.

**Performance Considerations**
Reviewers should look for obvious causes of unnecessary re-renders and suggest the use of `React.memo`, `useMemo`, or `useCallback` where appropriate. If a PR introduces a massive new dependency, the reviewer must question its necessity and ensure that it is lazy-loaded if it is not required for the initial page render. Data fetching logic must also be scrutinized to guarantee that API calls are efficient and properly cached.

**Security and Testing**
Security is paramount; reviewers must ensure no hardcoded secrets, API keys, or tokens are committed. Any user input must be properly sanitized before rendering to prevent Cross-Site Scripting (XSS) vulnerabilities. On the testing front, the reviewer must verify that adequate unit tests have been written for new logic, covering both the "happy path" and potential error states, thereby maintaining or improving overall test coverage.

## Communication Etiquette

Effective code reviews rely on positive communication. Reviewers should frame feedback as constructive suggestions rather than demands. For example, phrasing a comment as "Consider extracting this logic into a hook" is far more collaborative than "Move this to a hook."

Reviewers are encouraged to ask questions when they do not understand a specific implementation choice, such as complex regular expressions. Finally, code review is not solely for finding flaws; reviewers should actively praise elegant solutions, excellent test coverage, and well-written documentation.
