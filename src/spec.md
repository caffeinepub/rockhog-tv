# Specification

## Summary
**Goal:** Add new channel categories (Radio, DJs, IRL, Audio & Video Podcasts, PPV Events) across the app, including browsing, creator editing, display naming, and icons.

**Planned changes:**
- Extend the channel category model/storage so channels can be created, updated, stored, and fetched with the new category values alongside existing categories.
- Update the home page “Browse Categories” section to include clickable entries for Radio, DJs, IRL, Audio & Video Podcasts, and PPV Events that navigate to the existing category listing route.
- Update the creator channel editor category dropdown to include the new categories with clear English labels.
- Ensure category titles/badges use correct capitalization for the new categories across category pages and stream/detail views.
- Add new static category icon assets for the new categories and map them in the existing CategoryIcon component.

**User-visible outcome:** Users can browse and open category pages for Radio, DJs, IRL, Audio & Video Podcasts, and PPV Events; creators can assign these categories to channels; and the UI shows properly formatted labels and dedicated icons for each new category.
