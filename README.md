# @tchomb/api-client

Typed HTTP client for the [Tchomb](https://tchomb.com) video platform API.

## Installation

```bash
npm install @tchomb/api-client
```

## Usage

```typescript
import { createTchombClient } from '@tchomb/api-client';

const client = createTchombClient({
  baseUrl: 'https://api.tchomb.com',
  getAccessToken: async () => {
    // Return the user's auth token
    return session.access_token;
  },
});

// Fetch feed
const feed = await client.fetchFeed();

// Search
const results = await client.searchVideos('musique camerounaise');

// Get profile
const profile = await client.fetchProfile('creator-id');
```

## API

| Method | Description |
|--------|-------------|
| `fetchFeed(cursor?)` | Paginated video feed |
| `fetchProfile(userId)` | Full user profile |
| `searchVideos(query)` | Search videos by text |
| `searchProfiles(query)` | Search user profiles |
| `fetchTrending()` | Trending hashtags |
| `shareVideo(videoId)` | Increment share count |
| `recordView(videoId, seconds)` | Record view analytics |

## Part of Tchomb

| Package | Description |
|---------|-------------|
| [@tchomb/shared-types](https://github.com/yaamwebsolutions/tchomb-shared-types) | Shared TypeScript types |
| [@tchomb/ui](https://github.com/yaamwebsolutions/tchomb-ui) | Design system |
| **@tchomb/api-client** | Typed HTTP client |
| [@tchomb/upload](https://github.com/yaamwebsolutions/tchomb-upload) | Upload state machine |
| [@tchomb/player](https://github.com/yaamwebsolutions/tchomb-player) | Vertical video player |

## License

MIT
