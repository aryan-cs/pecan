import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface GroupEntryProps {
  id?: string;
  name: string;
  duration?: string;
  createdAt: number;
  active: boolean; // New prop
  onPress?: () => void;
}

export default function GroupEntry({ name, duration, createdAt, active, onPress }: GroupEntryProps) {
  const cardBg = useThemeColor({ light: '#fff', dark: '#1C1C1E' }, 'card');
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!duration || duration === "Unlimited") {
      setTimeLeft("∞");
      return;
    }

    // Helper to get duration in milliseconds
    const getDurationMs = () => {
      // Check if it's an ISO string (Custom date) or a duration string
      const isIsoDate = duration.includes("-") && duration.includes("T");
      
      if (isIsoDate) {
         // If it's a specific date, duration is diff between that date and creation
         return new Date(duration).getTime() - createdAt;
      } else {
        // Parse "5 minutes", "1 day", etc.
        const parts = duration.split(" ");
        const amount = parseInt(parts[0], 10);
        const unit = parts[1];

        let durationMs = 0;
        if (unit?.startsWith("minute")) durationMs = amount * 60 * 1000;
        if (unit?.startsWith("hour")) durationMs = amount * 60 * 60 * 1000;
        if (unit?.startsWith("day")) durationMs = amount * 24 * 60 * 60 * 1000;
        return durationMs;
      }
    };

    const formatTime = (ms: number) => {
        if (ms <= 0) return "00:00:00";
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        const hDisplay = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : "";
        const mDisplay = `${minutes.toString().padStart(2, '0')}:`;
        const sDisplay = seconds.toString().padStart(2, '0');
        return `${hDisplay}${mDisplay}${sDisplay}`;
    };

    // LOGIC SPLIT: Active vs Inactive
    if (!active) {
        // Frozen state: Just show the total duration
        const totalDuration = getDurationMs();
        setTimeLeft(formatTime(totalDuration));
        return; 
    }

    // Active state: Tick down
    const durationMs = getDurationMs();
    const targetTime = createdAt + durationMs;

    const calculateTick = () => {
      const now = Date.now();
      const diff = targetTime - now;
      setTimeLeft(formatTime(diff));
    };

    calculateTick();
    const interval = setInterval(calculateTick, 1000);
    return () => clearInterval(interval);

  }, [duration, createdAt, active]);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, { opacity: pressed ? 0.8 : 1 }] }>
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        
        {/* TOP RIGHT: Duration/Countdown */}
        <View style={styles.topRow}>
            {timeLeft ? (
                <ThemedText style={[styles.duration, !active && styles.inactiveDuration]}>
                    {timeLeft}
                </ThemedText>
            ) : null}
        </View>

        {/* BOTTOM LEFT: Title */}
        <View style={styles.bottomRow}>
          <ThemedText type="title" style={styles.name} numberOfLines={2}>
            {name}
          </ThemedText>
        </View>

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  card: {
    height: 120, 
    borderRadius: 16,
    paddingVertical: 12, 
    paddingHorizontal: 14,
    justifyContent: 'space-between', 
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  topRow: {
    width: '100%',
    alignItems: 'flex-end', 
  },
  bottomRow: {
    width: '100%',
    alignItems: 'flex-start', 
  },
  name: {
    fontStyle: 'italic',
    fontSize: 20,
  },
  duration: {
    fontSize: 15,
    fontWeight: '500', 
    fontVariant: ['tabular-nums'], 
    textAlign: 'right',
  },
  inactiveDuration: {
    opacity: 0.4, // Dim the text if the timer hasn't started
  }
});