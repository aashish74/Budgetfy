import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import IMAGES from '../assets/images';
import randomImage from '../assets/randomImage';
import EmptyList from '../components/emptyList';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Props>();
  const trips = useSelector((state: RootState) => state.trips.trips);
  
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={'#fff'}/>
    <View style = {{backgroundColor: '#fff'}}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Budgetify</Text>
        <TouchableOpacity style={{ padding: 10, paddingHorizontal: 15, backgroundColor: 'white', borderWidth: 0.2, borderColor: 'grey', borderRadius: 20 }}>
          <Text style={{color:'grey', fontWeight:'600'}}>Log out</Text>
        </TouchableOpacity>
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
            // keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                onPress={() => navigation.navigate('TripExpenses', {
                  place: item.place,
                  country: item.country
                })}
                style={{backgroundColor: 'white', marginBottom: 10, padding: 25, borderRadius: 20, shadowColor: 'black',
                  shadowOpacity: 0.26,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 10,
                  elevation: 3
                }} >
                  <View>
                    <Image style={{ height: 150, width: 150, marginBottom: 2 }}
                      source={randomImage()}
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }} >{item.place}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '300' }}>{item.country}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})