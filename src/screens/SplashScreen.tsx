import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Modern Custom Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <View style={styles.fishBody}>
                <View style={styles.fishEye} />
                <View style={styles.fishTail} />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Fish<Text style={styles.titleHighlight}>Lens</Text></Text>
        <Text style={styles.tagline}>Smart Fish Detection & Nutrition AI</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#06b6d4" style={styles.loader} />
        <Text style={styles.loadingText}>Menyiapkan kecerdasan buatan...</Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  circleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#06b6d4',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  fishBody: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#06b6d4',
    position: 'relative',
    justifyContent: 'center',
  },
  fishEye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0b0f19',
    position: 'absolute',
    right: 12,
    top: 7,
  },
  fishTail: {
    position: 'absolute',
    left: -12,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 16,
    borderRightColor: '#06b6d4',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  titleHighlight: {
    color: '#06b6d4',
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  loader: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
