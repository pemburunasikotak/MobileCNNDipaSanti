import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getFishNutrition } from '../data/fishData';

interface DetailScreenProps {
  fishId: string;
  onBack: () => void;
  onNavigate: (screen: any, params?: any) => void;
}

export default function DetailScreen({ fishId, onBack, onNavigate }: DetailScreenProps) {
  const fish = getFishNutrition(fishId);
  const normalizedId = fishId.toLowerCase();
  const isTidakSegar = normalizedId.includes('tidak segar');
  const isSegar = normalizedId.includes('segar') && !isTidakSegar;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasil Deteksi AI</Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => onNavigate('home')}>
          <Text style={styles.homeButtonText}>Beranda</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.fishIconContainer}>
            <Text style={styles.fishEmojiLarge}>🐟</Text>
          </View>
          <Text style={styles.fishName}>{fish.name}</Text>
          
          {(isSegar || isTidakSegar) && (
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isSegar ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderColor: isSegar ? '#10b981' : '#ef4444' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: isSegar ? '#10b981' : '#ef4444' }
              ]}>
                {isSegar ? '✓ Kondisi Segar' : '⚠️ Tidak Segar'}
              </Text>
            </View>
          )}

          <Text style={styles.scientificName}>{fish.scientificName}</Text>
          <Text style={styles.description}>{fish.description}</Text>
        </View>

        {isTidakSegar && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Peringatan Konsumsi</Text>
            <Text style={styles.warningText}>
              Berdasarkan hasil deteksi, ikan ini tidak segar. Kandungan nutrisi dan manfaat di bawah ini merupakan nilai standar untuk ikan dalam kondisi segar. Hindari mengonsumsi ikan yang sudah tidak segar karena dapat menyebabkan keracunan makanan.
            </Text>
          </View>
        )}

        {/* Quick Stats Grid */}
        <View style={styles.quickStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>🔥 Kalori</Text>
            <Text style={styles.statValue}>{fish.calories}</Text>
          </View>
          <View style={[styles.statBox, { borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
            <Text style={[styles.statLabel, { color: '#3b82f6' }]}>💪 Protein</Text>
            <Text style={[styles.statValue, { color: '#3b82f6' }]}>{fish.protein}</Text>
          </View>
          <View style={[styles.statBox, { borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
            <Text style={[styles.statLabel, { color: '#10b981' }]}>🧠 Omega-3</Text>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{fish.omega3}</Text>
          </View>
        </View>

        {/* Nutrient Progress Bars */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Kandungan Gizi Detail</Text>
          <Text style={styles.sectionSubtitle}>Persentase berdasarkan Angka Kecukupan Gizi (AKG) harian</Text>

          {fish.nutrients.map((nut, index) => (
            <View key={index} style={styles.nutrientRow}>
              <View style={styles.nutrientInfo}>
                <Text style={styles.nutrientLabel}>{nut.label}</Text>
                <Text style={styles.nutrientValue}>{nut.value}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${nut.percentage}%`, backgroundColor: nut.color }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Health Benefits */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Manfaat Kesehatan</Text>
          {fish.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.bulletPoint}>
                <Text style={styles.bulletText}>✓</Text>
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Cooking & Culinary Tips */}
        <View style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: '#f59e0b' }]}>
          <Text style={[styles.sectionTitle, { color: '#f59e0b', marginTop: 0 }]}>💡 Tips Penyajian Sehat</Text>
          <Text style={styles.tipsText}>{fish.tips}</Text>
        </View>

        {/* Re-scan Button */}
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => onNavigate('scan')}
        >
          <Text style={styles.rescanButtonText}>Pindai Ikan Lain</Text>
        </TouchableOpacity>
      </ScrollView>
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
    width: 80,
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
  homeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 80,
    alignItems: 'flex-end',
  },
  homeButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#171e2e',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  fishIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  fishEmojiLarge: {
    fontSize: 40,
  },
  fishName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  scientificName: {
    color: '#06b6d4',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 16,
  },
  description: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  warningTitle: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  warningText: {
    color: '#fca5a5',
    fontSize: 12,
    lineHeight: 18,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#171e2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ec4899',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionCard: {
    backgroundColor: '#171e2e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 16,
  },
  nutrientRow: {
    marginBottom: 14,
  },
  nutrientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nutrientLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  nutrientValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#0b0f19',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  bulletPoint: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  bulletText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  benefitText: {
    color: '#94a3b8',
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  tipsText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  rescanButton: {
    backgroundColor: '#0b0f19',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#06b6d4',
    marginTop: 12,
  },
  rescanButtonText: {
    color: '#06b6d4',
    fontSize: 15,
    fontWeight: '700',
  },
});
