import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useEffect } from 'react'
import randomImage from '../assets/randomImage';
import EmptyList from '../components/emptyList';
import BackButton from '../components/backButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import ExpenseCard from '../components/expensecard';
import { useSelector, useDispatch } from 'react-redux';
import { selectExpensesByTripId } from '../store/selectors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../store/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchTripExpenses } from '../store/expenseSlice';
import { AppDispatch } from '../store/store';

type RootStackParamList = {
  AddExpenses: { tripId: string };
};

export default function TripExpensesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { place, country, id: tripId } = route.params as { place: string; country: string; id: string };
  const expenses = useSelector(selectExpensesByTripId(tripId));
  const { currency } = useSelector((state: RootState) => state.currency);

  // Add this useEffect to fetch expenses when screen loads
  useEffect(() => {
    if (tripId) {
      dispatch(fetchTripExpenses(tripId));
    }
  }, [dispatch, tripId]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const convertedTotal = total * currency.rate;
    return convertedTotal.toFixed(2);
  }, [expenses, currency.rate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.place}>{place}</Text>
        <Text style={styles.country}>{country}</Text>
      </View>

      {/* Trip Image */}
      <View style={styles.imageContainer}>
        <Image 
          style={styles.tripImage}
          source={randomImage()}
        />
      </View>

      {/* Total Expenses Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expenses</Text>
        <Text style={styles.totalAmount}>
          {currency.symbol}{totalExpenses}
        </Text>
      </View>

      {/* Expenses Section */}
      <View style={styles.expensesContainer}>
        <View style={styles.expensesHeader}>
          <Text style={styles.expensesTitle}>Expenses</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddExpenses', { tripId })}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          data={expenses}
          ListEmptyComponent={<EmptyList />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.expensesList}
          renderItem={({item}) => (
            <ExpenseCard expense={item} />
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  backButtonContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 63,
    left: 10
  },
  header: {
    paddingTop: 6,
    paddingBottom: 20,
    alignItems: 'center'
  },
  place: {
    fontSize: 24,
    fontWeight: '600'
  },
  country: {
    fontSize: 16,
    color: '#666'
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  tripImage: {
    width: '100%',
    height: 360,
    // borderRadius: 20
  },
  totalCard: {
    backgroundColor: '#add8e6',
    margin: 10,
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
  },
  expensesContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  addButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: 'grey'
  },
  addButtonText: {
    color: 'grey',
    fontWeight: '600'
  },
  expensesList: {
    paddingBottom: 100
  }
});