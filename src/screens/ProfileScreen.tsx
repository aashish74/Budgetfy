import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import IMAGES from '../assets/images'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import { setCurrency } from '../store/currencySlice'

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.currency);
  const trips = useSelector((state: RootState) => state.trips.trips);
  const expenses = useSelector((state: RootState) => state.expenses);

  const currencies = [
    { symbol: '₹', id: 'INR', rate:1},
    { symbol: '$', id: 'USD', rate:0.011673},
    { symbol: '€', id: 'EUR', rate:0.0113},
  ];

  const handleCurrencyChange = () => {
    // Cycle through currencies
    const currentIndex = currencies.findIndex(c => c.id === currency.id);
    const nextIndex = (currentIndex + 1) % currencies.length;
    dispatch(setCurrency(currencies[nextIndex]));
  };

  const totalAmount = useMemo(() => {
    const total = Object.values(expenses).reduce((sum, tripExpenses) => {
      return sum + tripExpenses.reduce((tripSum, expense) => tripSum + expense.amount, 0);
    }, 0);
    return (total * currency.rate).toFixed(2);
  }, [expenses, currency.rate]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity>
        <Image 
          source={IMAGES.PROFILE}
          style={styles.profileImage}
        />
        </TouchableOpacity>
        <Text style={styles.userName}>Aashish Bhardwaj</Text>
        <Text style={styles.userEmail}>abc@gmail.com</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statAmount}>{currency.symbol}{totalAmount}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statAmount}>{trips.length || 0}</Text>
          <Text style={styles.statLabel}>Total Trips</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleCurrencyChange}
        >
          <Text style={styles.settingText}>Currency</Text>
          <View style={styles.currencyValue}>
            <Text style={styles.settingValue}>{currency.symbol} {currency.id}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Theme</Text>
          <Text style={styles.settingValue}>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Language</Text>
          <Text style={styles.settingValue}>English</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#add8e6',
    margin: 15,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  statCard: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  statAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  settingsContainer: {
    margin: 15,
    marginTop: 25,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    padding: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    margin: 15,
    marginTop: 'auto',
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: 'grey',
  },
  logoutText: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 16,
    fontWeight: '600',
  },
  currencyValue: {
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
})