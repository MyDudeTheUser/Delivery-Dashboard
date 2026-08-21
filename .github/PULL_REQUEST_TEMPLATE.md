## Description

<!-- Briefly describe the changes introduced by this PR. What problem does it solve? -->

## Related Issue(s)

<!-- Link to any related Jira tickets or GitHub issues (e.g., Fixes #123) -->

## Type of Change

<!-- Check the appropriate box -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] ♻️ Refactor (code cleanup, performance optimization, etc.)
- [ ] 📝 Documentation update

## Checklist

<!-- Ensure all these items are checked before requesting a review -->

- [ ] My code follows the project's style guidelines (run `npm run lint` and `npx prettier --write .`).
- [ ] I have performed a self-review of my own code.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] New and existing unit tests pass locally with my changes (`npm run test`).
- [ ] I have updated the documentation accordingly.

## UI Changes (If applicable)

<!-- If this PR changes the UI, please include screenshots or GIFs to help reviewers visualize the changes. -->

## Code Review Guidelines (For Reviewers)

1. **Functionality:** Does the code solve the problem described? Are there edge cases missed?
2. **Performance:** Are there any unnecessary re-renders? Are heavy components lazy-loaded?
3. **Security:** Is user input sanitized? Are there any exposed secrets?
4. **Testing:** Are the tests meaningful? Do they cover both success and failure states?
