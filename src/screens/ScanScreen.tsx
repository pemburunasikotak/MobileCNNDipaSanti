import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';

interface ScanScreenProps {
  onNavigate: (screen: any, params?: any) => void;
  onBack: () => void;
}

export default function ScanScreen({ onNavigate, onBack }: ScanScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [apiMode, setApiMode] = useState<'mock' | 'real'>('mock');
  const [apiUrl, setApiUrl] = useState('http://192.168.34.102:5001/predict');
  const [selectedFishMock, setSelectedFishMock] = useState<string>('kembung segar');
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const scanIntervalRef = useRef<any>(null);

  const mockFishes = [
    { id: 'gerabah segar', name: '🐟 Ikan Gerabah (Segar)' },
    { id: 'Gerabah tidak segar', name: '🐟 Ikan Gerabah (Tidak Segar)' },
    { id: 'kembung segar', name: '🐟 Ikan Kembung (Segar)' },
    { id: 'Kembung tidak segar', name: '🐟 Ikan Kembung (Tidak Segar)' },
    { id: 'kuniran segar', name: '🐟 Ikan Kuniran (Segar)' },
    { id: 'Kuniran tidak segar', name: '🐟 Ikan Kuniran (Tidak Segar)' },
  ];

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Fake progress animation
    let progress = 0;
    scanIntervalRef.current = setInterval(() => {
      progress += 10;
      if (progress <= 90) setScanProgress(progress);
    }, 200);

    // if (apiMode === 'mock') {
    //   setTimeout(() => {
    //     if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    //     setScanProgress(100);
    //     setIsScanning(false);
    //     onNavigate('detail', { fishId: selectedFishMock });
    //   }, 2000);
    // } else {
    // Real API Mode
    if (!selectedImage) {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setIsScanning(false);
      Alert.alert('Peringatan', 'Silakan pilih foto ikan terlebih dahulu!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || 'photo.jpg',
      } as any);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Jangan set Content-Type secara manual saat menggunakan FormData di React Native
        // agar fetch otomatis menambahkan boundary (contoh: multipart/form-data; boundary=---1234)
      });

      const data = await response.json();
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setScanProgress(100);
      setIsScanning(false);

      if (response.ok && data.success) {
        onNavigate('detail', { fishId: data.prediction });
      } else {
        Alert.alert('Error', data.error || 'Terjadi kesalahan saat memprediksi');
      }
    } catch (error: any) {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setIsScanning(false);
      const errorMsg = error?.message || String(error);
      Alert.alert('Gagal Terhubung', `Pesan Error: ${errorMsg}\n\nPastikan:\n1. Server Flask berjalan.\n2. HP/Emulator terhubung ke jaringan yang sama dengan IP 192.168.34.61\n3. (Jika pakai Emulator) Coba ganti IP ke 10.0.2.2`);
      console.error('Fetch error:', error);
    }
    // }
  };

  const openCamera = () => {
    setIsImagePickerVisible(false);
    setTimeout(async () => {
      try {
        const result = await launchCamera({ mediaType: 'photo', quality: 0.8, cameraType: 'back' });
        if (result.assets && result.assets.length > 0) {
          setSelectedImage(result.assets[0]);
        } else if (result.errorMessage) {
          Alert.alert('Error Kamera', result.errorMessage);
        }
      } catch (e: any) {
        Alert.alert('Error', e?.message || 'Gagal membuka kamera. Pastikan Anda sudah memberikan izin.');
      }
    }, 500);
  };

  const openGallery = () => {
    setIsImagePickerVisible(false);
    setTimeout(async () => {
      try {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 });
        if (result.assets && result.assets.length > 0) {
          setSelectedImage(result.assets[0]);
        } else if (result.errorMessage) {
          Alert.alert('Error Galeri', result.errorMessage);
        }
      } catch (e: any) {
        Alert.alert('Error', e?.message || 'Gagal membuka galeri. Pastikan Anda sudah memberikan izin.');
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Ikan AI</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Radar Scanner Area */}
        <View style={styles.scannerOuterBox}>
          <View style={styles.scannerBox}>
            {isScanning ? (
              <View style={styles.scanOverlay}>
                <View style={[styles.laserLine, { top: `${scanProgress}%` }]} />
                <Text style={styles.scanProgressText}>Memindai serat daging & kontur... {scanProgress}%</Text>
                <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
              </View>
            ) : selectedImage ? (
              <TouchableOpacity
                style={{ width: '100%', height: '100%' }}
                activeOpacity={0.7}
                onPress={() => setIsImagePickerVisible(true)}
              >
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{ width: '100%', height: '100%', borderRadius: 24 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.placeholderContent}
                activeOpacity={0.7}
                onPress={() => setIsImagePickerVisible(true)}
              >
                <Text style={styles.placeholderEmoji}>📸</Text>
                <Text style={styles.placeholderTitle}>Posisikan Kamera ke Ikan</Text>
                <Text style={styles.placeholderSub}>Pastikan pencahayaan cukup terang untuk tingkat akurasi maksimal</Text>
              </TouchableOpacity>
            )}

            {/* Corner Borders */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Configurations */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Pengaturan Pemindaian</Text>

          {/* Mode Selector */}
          <View style={styles.tabContainer}>
            {/* <TouchableOpacity
              style={[styles.tabButton, apiMode === 'mock' && styles.tabButtonActive]}
              onPress={() => setApiMode('mock')}
            >
              <Text style={[styles.tabButtonText, apiMode === 'mock' && styles.tabButtonTextActive]}>Simulasi AI</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.tabButton, apiMode === 'real' && styles.tabButtonActive]}
              onPress={() => setApiMode('real')}
            >
              <Text style={[styles.tabButtonText, apiMode === 'real' && styles.tabButtonTextActive]}>Integrasi API</Text>
            </TouchableOpacity>
          </View>

          {apiMode === 'mock' ? (
            <View style={styles.sectionBody}>
              <Text style={styles.label}>Pilih Ikan untuk Disimulasikan:</Text>
              {mockFishes.map((fish) => (
                <TouchableOpacity
                  key={fish.id}
                  style={[
                    styles.mockSelectButton,
                    selectedFishMock === fish.id && styles.mockSelectButtonActive,
                  ]}
                  onPress={() => setSelectedFishMock(fish.id)}
                >
                  <Text
                    style={[
                      styles.mockSelectText,
                      selectedFishMock === fish.id && styles.mockSelectTextActive,
                    ]}
                  >
                    {fish.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.sectionBody}>
              <Text style={styles.label}>URL Endpoint Prediksi CNN:</Text>
              <TextInput
                style={styles.input}
                value={apiUrl}
                onChangeText={setApiUrl}
                placeholder="http://10.0.2.2:5000/predict"
                placeholderTextColor="#64748b"
              />
              <Text style={styles.infoText}>
                * Gunakan `10.0.2.2` untuk menunjuk localhost komputer Anda jika menggunakan Emulator Android.
              </Text>
            </View>
          )}
        </View>

        {/* Scan Actions */}
        <TouchableOpacity
          style={[styles.scanActionBtn, isScanning && styles.scanActionBtnDisabled]}
          onPress={handleStartScan}
          disabled={isScanning}
        >
          <Text style={styles.scanActionBtnText}>
            {isScanning ? 'Menganalisis...' : 'Ambil Foto & Prediksi'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Image Picker Bottom Sheet */}
      <Modal
        visible={isImagePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsImagePickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsImagePickerVisible(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Pilih Sumber Foto</Text>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={openCamera}
            >
              <Text style={styles.sheetButtonIcon}>📷</Text>
              <Text style={styles.sheetButtonText}>Buka Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={openGallery}
            >
              <Text style={styles.sheetButtonIcon}>🖼️</Text>
              <Text style={styles.sheetButtonText}>Ambil dari Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetButton, styles.sheetCancelButton]}
              onPress={() => setIsImagePickerVisible(false)}
            >
              <Text style={styles.sheetCancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  scannerOuterBox: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  scannerBox: {
    width: '90%',
    height: '90%',
    backgroundColor: '#171e2e',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanProgressText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  placeholderEmoji: {
    fontSize: 54,
    marginBottom: 16,
  },
  placeholderTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  placeholderSub: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Scanner Frame Corners
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#06b6d4',
  },
  topLeft: {
    top: 16,
    left: 16,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 16,
    right: 16,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  settingsCard: {
    backgroundColor: '#171e2e',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  settingsTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0b0f19',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#171e2e',
  },
  tabButtonText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#06b6d4',
  },
  sectionBody: {
    marginTop: 4,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  mockSelectButton: {
    backgroundColor: '#0b0f19',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  mockSelectButtonActive: {
    borderColor: 'rgba(6, 182, 212, 0.4)',
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
  },
  mockSelectText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  mockSelectTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#0b0f19',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoText: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 6,
    lineHeight: 14,
  },
  scanActionBtn: {
    backgroundColor: '#06b6d4',
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  scanActionBtnDisabled: {
    backgroundColor: '#1e293b',
  },
  scanActionBtnText: {
    color: '#0b0f19',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#171e2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  sheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b0f19',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sheetButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  sheetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sheetCancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    justifyContent: 'center',
    marginTop: 8,
  },
  sheetCancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
