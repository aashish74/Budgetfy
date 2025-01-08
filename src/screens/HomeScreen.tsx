import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import { fetchUserTrips } from '../store/tripSlice';
import { AppDispatch } from '../store/store';

type Props = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Props>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { trips } = useSelector((state: RootState) => state.trips);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserTrips(user.uid));
    }
  }, [dispatch, user]);

  return (
    <SafeAreaView style = {{backgroundColor:'#fff', flex:1}}>
      <StatusBar backgroundColor={'#fff'}/>
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginTop:10}}>
        <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Welcome Aashish</Text>
      </View>
      <View style={{
        backgroundColor: '#add8e6', alignItems: 'center', borderRadius: 20, margin: 20, shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 3,
        }}>
        <Image source={IMAGES.BANNER}
          style={{ width: '60%', height: 230 }}
        />
      </View>
      <View style={{ paddingHorizontal: 11 }}>
        <View style = {{marginBottom:10}}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Recent Trips</Text>
        </View>
        <View style = {{height:500}}>
        <FlatList
          data={trips}
          ListEmptyComponent={<EmptyList />}
          numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id || ''}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('TripExpenses', {
                place: item.place,
                country: item.country, 
                id: item.id || ''
              })}
              style={styles.tripCard}
            >
              <View>
                <Image 
                  style={styles.tripImage} 
                  source={randomImage()} 
                />
                <Text style={styles.place}>{item.place}</Text>
                <Text style={styles.country}>{item.country}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        </View>
      </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  tripCard: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 25,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    flex: 1
  },
  tripImage: {
    height: 150,
    width: 150,
    marginBottom: 2
  },
  place: {
    fontWeight: 'bold',
    fontSize: 17
  },
  country: {
    fontSize: 15,
    fontWeight: '300'
  }
});