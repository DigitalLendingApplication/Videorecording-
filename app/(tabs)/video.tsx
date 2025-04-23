import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { ThemedView } from '@/components/ThemedView';
import { StyledButton } from '@/components/StyledButton';
import { VideoHeader } from '@/components/VideoHeader';

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
    <ThemedView style={styles.container}>
      <VideoHeader title="Video Picker" />
      <View style={styles.content}>
        <StyledButton title="Pick Video from Gallery" onPress={pickVideo} primary={true} />
        <StyledButton title="Record Video" onPress={recordVideo} primary={false} />
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
            <StyledButton 
              title={isPlaying ? "Pause Video" : "Play Video"} 
              onPress={togglePlayPause} 
              primary={true}
            />
          </>
        ) : (
          <Text style={styles.noVideoText}>No video selected</Text>
        )}
      </View>
    </ThemedView>
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
  noVideoText: {
    marginTop: 20,
    fontSize: 16,
    opacity: 0.7,
  }
}); 