# Specification

## Summary
**Goal:** Add a viewer-accessible Contact page that displays the site owner’s email address without any contact form or email-sending capability.

**Planned changes:**
- Add a new `/contact` route in the existing TanStack Router setup that renders within the existing `AppLayout`.
- Create a Contact page UI that shows `brianlellis24@gmail.com` as plain text and as a clickable `mailto:` link.
- Add a global navigation entry (in the footer) labeled “Contact” linking to `/contact`, visible on desktop and mobile and matching the current theme.

**User-visible outcome:** Users can navigate to a Contact page from anywhere in the app and view/click the site owner’s email address, without any form or in-app emailing.
