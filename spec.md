# RockHog TV

## Current State
- Full streaming platform with categories: Music, Gaming, Sports, Horror, Adult
- Internet Identity login, user profiles, chat widget (bottom-right floating)
- Bacon Cash economy: viewers can buy Bacon Cash via BuyBaconCashPage (/buy-bacon-cash), admins approve requests
- Streamers can receive tips and request withdrawals
- Creator Studio, Payment History, Contact, Sign Up pages
- No quick payment widget accessible from anywhere on the site

## Requested Changes (Diff)

### Add
- A floating Bacon Cash payment widget button (bottom-left corner) on every page
- Widget opens an animated panel (similar to ChatWidget) showing:
  - User's current Bacon Cash balance
  - Quick-buy amount picker (preset amounts: 50, 100, 250, 500, 1000 + custom input)
  - A "Buy Bacon Cash" submit button that calls the existing requestBaconCash mutation
  - Status/pending indicator showing latest request status
  - Link to /buy-bacon-cash full page for request history
- Widget is visible to all users but prompts login if unauthenticated

### Modify
- AppLayout.tsx: import and render the new BaconCashWidget alongside ChatWidget

### Remove
- Nothing removed
