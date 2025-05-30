import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import IMAGES from '../assets/images';
import randomImage from '../assets/randomImage';
import EmptyList from '../components/emptyList';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppDispatch } from '../store/store';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { LinearGradient } from 'react-native-linear-gradient';

type Props = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<Props>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { trips } = useSelector((state: RootState) => state.trips);
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = useTheme();

  useEffect(() => {
    if (user?.uid) {
      // No need to fetch from Firebase anymore
      // The trips are managed entirely in Redux now
    }
  }, [dispatch, user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Welcome Aashish
        </Text>

        <View style={[styles.banner, { 
          backgroundColor: mode === 'dark' ? '#1F2937' : '#E3F2FD',  // Different colors for dark/light modes
        }]}>
          <Image 
            source={IMAGES.BANNER} 
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Trips
        </Text>

        <View style={styles.tripsContainer}>
          <FlatList
            data={trips}
            ListEmptyComponent={<EmptyList />}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id || ''}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tripCard, { backgroundColor: theme.colors.card }]}
                onPress={() => navigation.navigate('TripExpenses', {
                  place: item.place,
                  country: item.country,
                  id: item.id || ''
                })}
              >
                <Image 
                  style={styles.tripImage}
                  source={randomImage()}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.02)']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '50%',
                  }}
                />
                <View style={styles.tripInfo}>
                  <Text style={[styles.place, { color: theme.colors.text }]}>
                    {item.place}
                  </Text>
                  <Text style={[styles.country, { color: theme.colors.grey }]}>
                    {item.country}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: width * 0.6,
    height: width * 0.4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tripsContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  tripCard: {
    width: (width - 44) / 2,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  tripImage: {
    width: '100%',
    height: (width - 44) / 2.2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tripInfo: {
    padding: 12,
    paddingVertical: 14,
    backgroundColor: 'transparent',
  },
  place: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  country: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '500',
  },
});