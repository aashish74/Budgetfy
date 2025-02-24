import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, Alert, Dimensions, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, useColorScheme } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { addTrip } from '../store/tripSlice';
import IMAGES from '../assets/images';
import { useTheme } from '../hooks/useTheme';
import { ThemedView } from '../components/ThemedView';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;

export default function ExpensesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const theme = useTheme();
  
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState('');

  const handleNext = () => {
    if (place && country && user?.uid) {
      dispatch(addTrip({ 
        place, 
        country,
        userId: user.uid,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }));
      
      setPlace('');
      setCountry('');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      Alert.alert('Please fill in both country and state');
    }
  };

  const isDarkmode = useColorScheme() === 'dark';
  
  return (
    <SafeAreaView style={{ flex: 1, marginTop:60}}>
      <StatusBar
        barStyle = {isDarkmode ? 'light-content' : 'dark-content'} 
      />
          <ThemedView style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Add Trip
            </Text>

            <View style={styles.bannerContainer}>
              <Image 
                source={IMAGES[4]} 
                style={styles.bannerImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Place</Text>
              <TextInput
                style={[styles.input, {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text
                }]}
                value={place}
                onChangeText={setPlace}
                placeholderTextColor={theme.colors.grey}
                placeholder="Enter place name"
              />

              <Text style={[styles.label, { color: theme.colors.text }]}>Country</Text>
              <TextInput
                style={[styles.input, {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text
                }]}
                value={country}
                onChangeText={setCountry}
                placeholderTextColor={theme.colors.grey}
                placeholder="Enter country name"
              />
            </View>

            {/* <View style={{ height: 100 }} /> */}
          </ThemedView>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.success }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Add Trip</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 16,
  },
  bannerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  bannerImage: {
    width: width * 0.7,
    height: width * 0.5,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addButton: {
    marginHorizontal: 16,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});