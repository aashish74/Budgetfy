import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { addExpense } from '../store/expenseSlice';
import BackButton from '../components/backButton';
import IMAGES from '../assets/images';
import { categories } from '../components/categories';
import { useTheme } from '../hooks/useTheme';
import { ThemedView } from '../components/ThemedView';

type Props = NativeStackNavigationProp<RootStackParamList>;
type RouteParams = {
  tripId: string;
  place: string;
  country: string;
};

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375; // Base scale factor

export default function AddExpensesScreen() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<Props>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const theme = useTheme();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleAddExpense = () => {
    try {
      if (!user?.uid) {
        Alert.alert('Error', 'User not found');
        return;
      }
      
      if (!title || !amount || !category) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      dispatch(addExpense({
        tripId: route.params.tripId,
        title,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString(),
        userId: user.uid
      }));
      
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add expense');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton/>
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          Add Expense
        </Text>
      </View>

      <View style={styles.bannerContainer}>
        <Image 
          source={IMAGES.EXPENSEBANNER}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Item Name</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
            color: theme.colors.text
          }]}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={theme.colors.grey}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Item Amount (in ₹)
        </Text>
        <View style={styles.amountContainer}>
          <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>₹</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              flex: 1
            }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.grey}
          />
        </View>

        <Text style={[styles.categoryLabel, { color: theme.colors.grey }]}>
          Categories
        </Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryButton,
                { 
                  backgroundColor: category === cat.value 
                    ? theme.colors.primary 
                    : theme.colors.card,
                  borderColor: category === cat.value 
                    ? theme.colors.primary 
                    : theme.colors.border,
                }
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={[
                styles.categoryText,
                { 
                  color: category === cat.value 
                    ? theme.colors.background 
                    : theme.colors.text,
                  fontWeight: category === cat.value ? '600' : '400'
                }
              ]}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.success }]}
        onPress={handleAddExpense}
      >
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: scale * 34,
  },
  backButton: {
    position: 'absolute',
    top: scale * 43,
    left: scale * 6,
    zIndex: 1,
    // backgroundColor:'#f0f0f0'
  },
  headerContainer: {
    paddingTop: scale * 8,
    alignItems: 'center',
  },
  headerText: {
    fontSize: scale * 24,
    fontWeight: '600',
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: scale * 10,
  },
  bannerImage: {
    height: height * 0.3,
    width: width * 0.8,
  },
  formContainer: {
    marginHorizontal: scale * 25,
    marginBottom: scale * 15,
  },
  label: {
    fontSize: scale * 20,
    fontWeight: '600',
    marginBottom: scale * 10,
  },
  input: {
    padding: scale * 12,
    borderWidth: 0.2,
    borderRadius: scale * 20,
    marginBottom: scale * 10,
    fontSize: scale * 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: scale * 20,
    marginRight: scale * 8,
  },
  categoryLabel: {
    fontWeight: '600',
    fontSize: scale * 20,
    marginBottom: scale * 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale * 12,
    marginBottom: scale * 20,
  },
  categoryButton: {
    paddingHorizontal: scale * 16,
    paddingVertical: scale * 12,
    borderRadius: scale * 20,
    borderWidth: 1,
    marginBottom: scale * 8,
  },
  categoryText: {
    fontSize: scale * 15,
  },
  addButton: {
    padding: scale * 12,
    marginHorizontal: scale * 17,
    borderRadius: scale * 16,
    marginBottom: scale * 30,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: scale * 22,
    fontWeight: "bold",
  },
});