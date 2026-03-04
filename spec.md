# RockHog TV

## Current State
Full-stack streaming platform with:
- Auth via Internet Identity
- Multiple categories (music, gaming, sports, horror, adult, radio, DJs, IRL, podcasts, PPV)
- Live stream pages with per-channel chat rooms
- Bacon Cash virtual currency
- Creator Studio with stream key/URL setup
- Contact page, Sign Up page, Payment history
- AppLayout wraps all pages with header/footer

## Requested Changes (Diff)

### Add
- A floating chat widget that appears on all pages (rendered in AppLayout)
- Widget is a collapsible panel anchored to the bottom-right corner
- When expanded: shows a chat interface using the existing backend chat APIs (createDefaultChatRoom, getChatRoomMessages, postMessage)
- Uses a shared "global" chat room (created on first use via createDefaultChatRoom)
- Authenticated users can send messages; guests see messages but get prompted to log in to chat
- Messages auto-refresh every few seconds
- Widget has a toggle button (chat bubble icon) to open/close it

### Modify
- AppLayout.tsx: render the new ChatWidget component above the closing div

### Remove
- Nothing

## Implementation Plan
1. Create `src/components/chat/ChatWidget.tsx` - floating widget with open/close toggle, message list, input form
2. Wire to backend: use `createDefaultChatRoom` to get/create the global room ID on mount, `getChatRoomMessages` to fetch messages (poll every 3s), `postMessage` to send
3. Show user's display name from `useGetCallerUserProfile` hook; fall back to "Guest"
4. Add the widget to AppLayout.tsx
5. Apply data-ocid markers to all interactive elements
