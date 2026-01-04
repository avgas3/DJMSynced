# Playback Position Sync Feature

## Overview
This feature ensures that when players join an Owlbear Rodeo room, their music streams automatically sync to the same playback position as the GM's streams. This creates a synchronized audio experience for all participants.

## How It Works

### For the GM
1. **Position Tracking**: As streams play, the GM's player tracks the current playback position every 2 seconds
2. **Broadcasting**: These positions are automatically synced to OBR room metadata along with a timestamp
3. **Continuous Updates**: Position data is continuously updated so new players can sync to the current position

### For Players
1. **Initial Sync**: When joining the room or loading the extension, players read the GM's current stream positions
2. **Time Adjustment**: The system calculates the appropriate position based on:
   - The GM's last known position
   - The time elapsed since that position was recorded
   - Whether the stream is currently playing or paused
3. **Seamless Playback**: Players' streams automatically seek to the calculated position, ensuring synchronization

## Technical Implementation

### Components Modified

#### 1. Player Component (`src/player/Player.jsx`)
- Added `onProgress` callback to track playback position
- Added `seekToPosition` prop to programmatically seek to a specific time
- Added React ref to access ReactPlayer's seekTo method
- Set progress interval to 2 seconds for efficient position tracking

#### 2. Metadata Store (`src/metadataStore.jsx`)
- Added `streamPositions` state object to store position data for each stream
- Structure: `{streamLinkId: {playedSeconds, syncTimestamp}}`
- Added `updateStreamPosition` action for GM to update positions
- Added `setStreamPositions` action for players to receive position updates
- Modified `setFirstState` to include initial position data

#### 3. Metadata Sync (`src/MetadataSync.jsx`)
- Extended sync logic to detect position changes
- Added `streamPositions` to the OBR room metadata synchronization
- Position data is synced alongside other state (paused, soundOutput, currentlyStreaming)

#### 4. App Component (`src/App.jsx`)
- **GM Side**:
  - Tracks playback progress via `handleProgress` function
  - Updates position in metadata store every 2 seconds
  
- **Player Side**:
  - Loads initial positions on room join
  - Listens for position updates via `onMetadataChange`
  - Calculates adjusted position based on time elapsed
  - Applies seek positions to synchronize playback
  - Only syncs if position data is recent (within 5 seconds)

### Sync Algorithm

When a player receives position data:
```javascript
adjustedPosition = GM_playedSeconds + (currentTime - GM_syncTimestamp) / 1000
```

This ensures that even if there's network delay, the player seeks to where the GM's stream currently is, not where it was when the data was sent.

### Performance Considerations

- **Update Frequency**: Position updates every 2 seconds (configurable via `progressInterval`)
- **Stale Data Protection**: Position updates older than 5 seconds are ignored to prevent seeking to outdated positions
- **One-Time Seeking**: Seek positions are cleared after being applied to prevent repeated seeking

## Usage

No user action required! The sync feature works automatically:

1. GM starts playing streams as usual
2. Players join the room or refresh their extension
3. Players' streams automatically sync to GM's current playback position
4. All participants hear synchronized audio

## Benefits

- **Immersive Experience**: All players hear the same music at the same time
- **No Manual Sync Needed**: Automatic synchronization eliminates the need for manual coordination
- **Dynamic Joining**: Players joining mid-session are automatically synced to current playback
- **Resilient**: Handles network delays and accounts for time elapsed since last update
