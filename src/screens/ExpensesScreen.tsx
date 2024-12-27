import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import IMAGES from '../assets/images';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch } from 'react-redux';
import { addTrip } from '../store/tripSlice';

const ExpensesScreen = () => {
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState('');
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const handleNext = () => {
    if(place && country){
      dispatch(addTrip({ 
        place, 
        country
      }));
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Home'
        })
      );
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop:50
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExpensesScreen;