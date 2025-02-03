import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createExpense } from '../store/expenseSlice';
import BackButton from '../components/backButton';
import IMAGES from '../assets/images';
import { categories } from '../components/categories';

type Props = NativeStackNavigationProp<RootStackParamList>;
type RouteParams = {
  tripId: string;
  place: string;
  country: string;
};

export default function AddExpensesScreen() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<Props>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleAddExpense = async () => {
    try {
      if (!user?.uid) {
        Alert.alert('Error', 'User not found');
        return;
      }
      
      if (!title || !amount || !category) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const expenseData = {
        tripId: route.params.tripId,
        title,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(),
        userId: user.uid
      };

      await dispatch(createExpense(expenseData)).unwrap();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add expense');
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1, paddingTop:13}}>
      <View style={{ position: 'absolute', zIndex: 1, top: 15, left: 6 }}>
        <BackButton />
      </View>
      <View style={{ paddingTop: 8, }}>
        <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 24 }}>Add Expense</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, }}>
        <Image source={IMAGES.EXPENSEBANNER}
          style={{ height: 400, width: 350 }}
        />
      </View>
      <View style={{ marginHorizontal: 25, marginBottom: 15 }}>
        <Text style={{ fontSize: 25, fontWeight: '600', marginBottom: 10 }}>Item Name</Text>
        <TextInput
          style={{ padding: 12, borderWidth: 0.2, borderRadius: 20, marginBottom: 10 }}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={{ fontSize: 25, fontWeight: '600', marginBottom: 10 }}>
          Item Amount (in ₹)
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>₹</Text>
          <TextInput
            style={{ flex: 1, padding: 12, borderWidth: 0.2, borderRadius: 20 }}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount in INR"
          />
        </View>
      </View>
      <View style={{ marginHorizontal: 25 }}>
        <Text style={{ color: 'grey', fontWeight: '600', fontSize: 20, marginBottom: 15, }}>Categories</Text>
        <View style={
          {
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: 20,
          }
        }>
          {
            categories.map((cat: any) => {
              return (
                <TouchableOpacity
                  key={cat.value}
                  style={
                    {
                      backgroundColor: category === cat.value ? '#e6f3ff' : '#f5f5f5',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: category === cat.value ? '#007AFF' : '#e0e0e0',
                      marginBottom: 8,
                    }
                  }
                  onPress={() => setCategory(cat.value)}
                >
                  <Text style={
                    {
                      fontSize: 15,
                      color: category === cat.value ? '#007AFF' : '#666',
                      fontWeight: category === cat.value ? '600' : '400'
                    }
                  }>{cat.title}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={{ marginBottom: 30, backgroundColor: '#32cd32', padding: 12, marginHorizontal: 17, borderRadius: 16 }}
          onPress={handleAddExpense}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: "bold" }}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})