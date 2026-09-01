import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { fishDatabase } from '../data/fishData';

interface HomeScreenProps {
  onNavigate: (screen: any, params?: any) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const recommendedFishes = Object.values(fishDatabase);

  const filteredFishes = recommendedFishes.filter(fish =>
    fish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, Selamat Pagi</Text>
          <Text style={styles.username}>Pecinta Ikan Sehat 👋</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>PI</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Nutrisi */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Kembung vs Salmon</Text>
            <Text style={styles.bannerSub}>Tahukah Anda? Ikan kembung lokal memiliki Omega-3 setara bahkan lebih tinggi dari Salmon!</Text>
            <TouchableOpacity 
              style={styles.bannerButton}
              onPress={() => onNavigate('detail', { fishId: 'kembung' })}
            >
              <Text style={styles.bannerButtonText}>Bandingkan Gizi</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerGraphic}>
            <View style={styles.shieldRing}>
              <Text style={styles.shieldText}>100%</Text>
              <Text style={styles.shieldSub}>Lokal</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kandungan gizi ikan (misal: Salmon)..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton}>
            <View style={styles.searchIconOuter}>
              <View style={styles.searchIconInner} />
            </View>
          </TouchableOpacity>
        </View>

        {searchQuery.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hasil Pencarian</Text>
            {filteredFishes.map(fish => (
              <TouchableOpacity
                key={fish.id}
                style={styles.fishCard}
                onPress={() => onNavigate('detail', { fishId: fish.id })}
              >
                <View style={styles.fishCardInfo}>
                  <Text style={styles.fishCardName}>{fish.name}</Text>
                  <Text style={styles.fishCardSci}>{fish.scientificName}</Text>
                </View>
                <View style={styles.fishCardStats}>
                  <Text style={styles.fishCardCal}>{fish.calories}</Text>
                  <Text style={styles.fishCardProt}>Protein {fish.protein}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {filteredFishes.length === 0 && (
              <Text style={styles.emptyText}>Ikan tidak ditemukan di database local.</Text>
            )}
          </View>
        ) : (
          <>
            {/* Menu Utama Grid */}
            <Text style={styles.sectionTitle}>Menu Utama</Text>
            <View style={styles.menuGrid}>
              {/* Scan Menu (Main) */}
              <TouchableOpacity
                style={[styles.menuItemLarge]}
                onPress={() => onNavigate('scan')}
              >
                <View style={styles.scanBadge}>
                  <Text style={styles.scanBadgeText}>Rekomendasi</Text>
                </View>
                <View style={styles.menuIconBigOuter}>
                  <View style={styles.menuIconBigInner}>
                    <View style={styles.scannerLine} />
                  </View>
                </View>
                <Text style={styles.menuItemTitleLarge}>Scan & Prediksi Ikan</Text>
                <Text style={styles.menuItemDescLarge}>Gunakan kamera untuk deteksi jenis ikan & info gizi otomatis</Text>
              </TouchableOpacity>

              <View style={styles.menuRow}>
                <TouchableOpacity style={styles.menuItemSmall} onPress={() => {}}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={{ color: '#10b981', fontSize: 18, fontWeight: '700' }}>💡</Text>
                  </View>
                  <Text style={styles.menuItemTitleSmall}>Tips Gizi</Text>
                  <Text style={styles.menuItemDescSmall}>Pola konsumsi sehat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItemSmall} onPress={() => {}}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <Text style={{ color: '#f59e0b', fontSize: 18, fontWeight: '700' }}>⏳</Text>
                  </View>
                  <Text style={styles.menuItemTitleSmall}>Riwayat</Text>
                  <Text style={styles.menuItemDescSmall}>Hasil scan terakhir</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rekomendasi Ikan Teratas */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Rekomendasi Gizi Tinggi</Text>
                <Text style={styles.seeAll}>Lihat Semua</Text>
              </View>

              {recommendedFishes.slice(0, 3).map(fish => (
                <TouchableOpacity
                  key={fish.id}
                  style={styles.fishListItem}
                  onPress={() => onNavigate('detail', { fishId: fish.id })}
                >
                  <View style={styles.fishItemLeft}>
                    <View style={styles.fishIconBg}>
                      <Text style={styles.fishEmoji}>🐟</Text>
                    </View>
                    <View style={styles.fishItemText}>
                      <Text style={styles.fishListItemName}>{fish.name}</Text>
                      <Text style={styles.fishListItemSci}>{fish.scientificName}</Text>
                    </View>
                  </View>
                  <View style={styles.fishItemRight}>
                    <View style={styles.badgeCal}>
                      <Text style={styles.badgeCalText}>{fish.calories}</Text>
                    </View>
                    <Text style={styles.fishListItemProt}>Prot: {fish.protein}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
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
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  greeting: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#171e2e',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  bannerLeft: {
    flex: 1.3,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginVertical: 10,
    lineHeight: 17,
  },
  bannerButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#0b0f19',
    fontSize: 12,
    fontWeight: '700',
  },
  bannerGraphic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
  },
  shieldSub: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#171e2e',
    borderRadius: 16,
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchInput: {
    flex: 1,
    height: 52,
    color: '#ffffff',
    fontSize: 14,
  },
  searchButton: {
    padding: 8,
  },
  searchIconOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#06b6d4',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconInner: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 6,
    height: 2,
    backgroundColor: '#06b6d4',
    transform: [{ rotate: '45deg' }],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 14,
  },
  menuGrid: {
    width: '100%',
  },
  menuItemLarge: {
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  scanBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#06b6d4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scanBadgeText: {
    color: '#0b0f19',
    fontSize: 10,
    fontWeight: '800',
  },
  menuIconBigOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuIconBigInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scannerLine: {
    width: 32,
    height: 2,
    backgroundColor: '#10b981',
    position: 'absolute',
  },
  menuItemTitleLarge: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  menuItemDescLarge: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 18,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemSmall: {
    flex: 1.0,
    backgroundColor: '#171e2e',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemTitleSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  menuItemDescSmall: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 12,
    color: '#06b6d4',
    fontWeight: '600',
  },
  fishListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#171e2e',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  fishItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fishIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  fishEmoji: {
    fontSize: 20,
  },
  fishItemText: {
    marginLeft: 14,
  },
  fishListItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  fishListItemSci: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontStyle: 'italic',
  },
  fishItemRight: {
    alignItems: 'flex-end',
  },
  badgeCal: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(236, 72, 153, 0.2)',
  },
  badgeCalText: {
    color: '#ec4899',
    fontSize: 11,
    fontWeight: '700',
  },
  fishListItemProt: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 6,
    fontWeight: '500',
  },
  fishCard: {
    backgroundColor: '#171e2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  fishCardInfo: {
    flex: 1,
  },
  fishCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  fishCardSci: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  fishCardStats: {
    alignItems: 'flex-end',
  },
  fishCardCal: {
    color: '#ec4899',
    fontSize: 13,
    fontWeight: '700',
  },
  fishCardProt: {
    color: '#3b82f6',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },
  section: {
    marginVertical: 10,
  },
});
