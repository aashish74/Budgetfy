import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createTrip } from '../store/tripSlice';
import IMAGES from '../assets/images';


export default function ExpensesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState('');

  const handleNext = async () => {
    if (place && country) {
      if (!user?.uid) {
        console.log('No user found');
        return;
      }

      try {
        console.log('Creating trip with data:', { place, country, userId: user.uid });
        await dispatch(createTrip({ 
          place, 
          country,
          userId: user.uid
        })).unwrap();
        
        // Clear the inputs immediately
        setPlace('');
        setCountry('');
        
        // Force navigation to Home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        
      } catch (error) {
        console.error('Error creating trip:', error);
      }
    } else {
      // Optional: Add alert if fields are empty
      Alert.alert('Please fill in both country and state');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#fff'}/>
      <View style={{ marginTop: 15 }}>
        <Text style={styles.heading}>Add Trip</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginTop: 7 }}>
          <Image source={IMAGES[4]}
            style={{ height: 350, width: 350 }}
          />
        </View>
        <View style={{ marginHorizontal: 15 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>Which Country</Text>
          <TextInput
            style={{ padding: 12, borderWidth: 0.2, borderRadius: 20, marginBottom: 10 }}
            value={country}
            onChangeText={ setCountry}
          />
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>Which State</Text>
          <TextInput
            style={{ padding: 12, borderWidth: 0.5, borderRadius: 20 }}
            value={place}
            onChangeText={setPlace}
          />
        </View>
        <View style={{ marginHorizontal: 18, marginTop: 18 }}>
          <Text style={{ color: 'grey', fontSize: 18, fontWeight: '500' }}>Add your expense by opening Trip from Home screen</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={{ marginBottom: 30, backgroundColor: '#32cd32', padding: 12, marginHorizontal: 17, borderRadius: 16 }}
          onPress={handleNext}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: "bold" }}>Add Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop:25
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});