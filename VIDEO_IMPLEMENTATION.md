# Video Picker Implementation Guide

This document explains how the video picker functionality was implemented in this app and how to reuse it in other projects.

## Overview

The implementation uses:
- `expo-video` for video playback (new recommended package over expo-av)
- `expo-image-picker` for selecting/recording videos
- Custom UI components for a cohesive look and feel

## Installation

```bash
npx expo install expo-video expo-image-picker
```

## Configuration

In your `app.json` or `app.config.js`, add the following to enable background playback and picture-in-picture mode:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true,
          "supportsPictureInPicture": true
        }
      ]
    ]
  }
}
```

## Core Implementation

Here's the essential code for the video picker functionality:

```tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

export default function VideoPickerScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  
  // Create a video player with null source initially
  const player = useVideoPlayer(null, player => {
    player.loop = true;
  });
  
  // Get the current playing state
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      player.replace(result.assets[0].uri);
      player.play();
    }
  };

  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to use camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      player.replace(result.assets[0].uri);
      player.play();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button title="Pick Video from Gallery" onPress={pickVideo} />
        <Button title="Record Video" onPress={recordVideo} />
        {videoUri ? (
          <>
            <View style={styles.videoContainer}>
              <VideoView 
                player={player}
                style={styles.video}
                allowsFullscreen
                allowsPictureInPicture
                nativeControls={true}
              />
            </View>
            <Button 
              title={isPlaying ? "Pause Video" : "Play Video"} 
              onPress={togglePlayPause} 
            />
          </>
        ) : (
          <Text>No video selected</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
```

## Key Concepts

### 1. Video Player Creation

```tsx
const player = useVideoPlayer(null, player => {
  player.loop = true;
});
```

- Use `useVideoPlayer` to create a video player instance
- Start with `null` source and replace it when a video is selected
- Configure player options in the callback function

### 2. Event Handling

```tsx
const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
```

- Track player state changes with `useEvent`
- Available events: 'playingChange', 'timeUpdate', 'statusChange', etc.
- Initial values are provided as third parameter

### 3. Video Selection/Recording

Both functions follow the same pattern:
1. Request appropriate permission
2. Launch picker or camera
3. When video is selected/recorded:
   - Set the video URI in state
   - Replace the player's source
   - Start playback

### 4. Video Playback

```tsx
<VideoView 
  player={player}
  style={styles.video}
  allowsFullscreen
  allowsPictureInPicture
  nativeControls={true}
/>
```

- `VideoView` displays the video and requires a player instance
- `allowsFullscreen` enables fullscreen mode
- `allowsPictureInPicture` enables PiP mode (requires configuration in app.json)
- `nativeControls` shows platform-native controls

### 5. Playback Control

```tsx
const togglePlayPause = () => {
  if (isPlaying) {
    player.pause();
  } else {
    player.play();
  }
};
```

Control playback with player methods:
- `player.play()` - Start playback
- `player.pause()` - Pause playback
- `player.replace(uri)` - Change video source
- `player.seekBy(seconds)` - Seek relative to current position

## Advanced Usage

### Custom Video Source

```tsx
const customSource = {
  uri: 'https://example.com/video.mp4',
  headers: { 'Authorization': 'Bearer token' },
  metadata: {
    title: 'My Video',
    artist: 'Creator Name',
    artwork: 'https://example.com/artwork.jpg'
  }
};

player.replace(customSource);
```

### Video Preloading

For a smooth transition between videos, you can preload the next video:

```tsx
// Create multiple players
const player1 = useVideoPlayer(video1Uri);
const player2 = useVideoPlayer(video2Uri);

// Switch between them
function switchVideo() {
  setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
}
```

## Troubleshooting

1. **Missing Permissions**: Ensure you've requested camera and media library permissions

2. **Playback Issues**: Check network connectivity for remote videos

3. **Background Playback**: Make sure the plugin is correctly configured in app.json

4. **Black Screen**: Verify that the video URI is valid and the format is supported

## Resources

- [expo-video Documentation](https://docs.expo.dev/versions/latest/sdk/video/)
- [expo-image-picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/) 