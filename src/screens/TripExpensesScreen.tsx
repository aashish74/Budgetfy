import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native'
import React, { useMemo, useState, useEffect } from 'react'
import randomImage from '../assets/randomImage';
import EmptyList from '../components/emptyList';
import BackButton from '../components/backButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import ExpenseCard from '../components/expensecard';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { ThemedView } from '../components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  AddExpenses: { tripId: string };
};

export default function TripExpensesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { place, country, id: tripId } = route.params as { place: string; country: string; id: string };
  const expenses = useSelector((state: RootState) => state.expenses[tripId] || []);
  const { targetCurrency } = useSelector((state: RootState) => state.currency);
  const theme = useTheme();
  
  // Budget state
  const [budget, setBudget] = useState<number | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // Load saved budget when component mounts
  useEffect(() => {
    const loadBudget = async () => {
      try {
        const savedBudget = await AsyncStorage.getItem(`budget_${tripId}`);
        if (savedBudget !== null) {
          setBudget(parseFloat(savedBudget));
        }
      } catch (error) {
        console.error('Error loading budget:', error);
      }
    };

    loadBudget();
  }, [tripId]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    // amount is in INR, convert to target currency
    const convertedTotal = total * targetCurrency.rate;
    return convertedTotal.toFixed(2);
  }, [expenses, targetCurrency.rate]);

  // Calculate budget progress
  const budgetProgress = useMemo(() => {
    if (!budget || budget <= 0) return 0;
    const progress = (parseFloat(totalExpenses) / budget) * 100;
    return Math.min(progress, 100); // Cap at 100%
  }, [totalExpenses, budget]);

  // Handle budget save
  const handleSaveBudget = async () => {
    const budgetValue = parseFloat(budgetInput);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount');
      return;
    }
    
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(`budget_${tripId}`, budgetValue.toString());
      setBudget(budgetValue);
      setShowBudgetModal(false);
    } catch (error) {
      console.error('Error saving budget:', error);
      Alert.alert('Error', 'Failed to save budget. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={[styles.place, { color: 'black' }]}>{place}</Text>
        <Text style={[styles.country, { color: theme.colors.grey }]}>{country}</Text>
      </View>

      {/* Trip Image */}
      <View style={styles.imageContainer}>
        <Image 
          style={styles.tripImage}
          source={randomImage()}
        />
      </View>

      {/* Financial Summary Cards */}
      <View style={styles.financialSummary}>
        {/* Total Expenses Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
            Total Expenses
          </Text>
          <Text style={[styles.cardAmount, { color: theme.colors.text }]}>
            {targetCurrency.symbol}{totalExpenses}
          </Text>
        </View>

        {/* Budget Card */}
        <TouchableOpacity 
          style={[styles.summaryCard, { 
            backgroundColor: budget ? theme.colors.card : theme.colors.border,
            borderWidth: budget ? 0 : 1,
            borderStyle: 'dashed',
            borderColor: theme.colors.text
          }]}
          onPress={() => {
            setBudgetInput(budget ? budget.toString() : '');
            setShowBudgetModal(true);
          }}
        >
          <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
            {budget ? 'Total Budget' : 'Set Budget'}
          </Text>
          {budget ? (
            <Text style={[styles.cardAmount, { color: theme.colors.text }]}>
              {targetCurrency.symbol}{budget.toFixed(2)}
            </Text>
          ) : (
            <Text style={[styles.addBudgetText, { color: theme.colors.text }]}>
              + Add Budget
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Progress Bars Section */}
      {budget && budget > 0 && (
        <View style={styles.progressBarsContainer}>
          {/* Combined Progress Bar */}
          <View style={styles.progressBarSection}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${budgetProgress}%`,
                    backgroundColor: budgetProgress > 90 ? '#FF6B6B' : 
                                    budgetProgress > 75 ? '#FFB347' : 
                                    '#4ECDC4'
                  }
                ]} 
              />
            </View>
            <View style={styles.progressLabelContainer}>
              {/* <Text style={[styles.progressLabel, { color: 'black' }]}>
                {targetCurrency.symbol}{parseFloat(totalExpenses).toFixed(0)} of {targetCurrency.symbol}{budget.toFixed(0)}
              </Text> */}
              <Text style={[styles.progressLabel, { color: 'black' }]}>
                {budgetProgress.toFixed(0)}% used
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Budget Edit Modal */}
      <Modal
        visible={showBudgetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {budget ? 'Edit Budget' : 'Set Budget'}
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>
                {targetCurrency.symbol}
              </Text>
              <TextInput
                style={[styles.budgetInput, { color: theme.colors.text }]}
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                placeholder="Enter budget amount"
                placeholderTextColor={theme.colors.grey}
                autoFocus
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowBudgetModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSaveBudget}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Expenses Section */}
      <View style={[styles.expensesContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.expensesHeader}>
          <Text style={[styles.expensesTitle, { color: theme.colors.text }]}>
            Expenses
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }]}
            onPress={() => navigation.navigate('AddExpenses', { tripId })}
          >
            <Text style={[styles.addButtonText, { color: theme.colors.grey }]}>
              Add Expense
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          ListEmptyComponent={<EmptyList />}
          contentContainerStyle={styles.expensesList}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:40
  },
  backButtonContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
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
  financialSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    margin: 5,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    minHeight: 120,
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 16,
    marginBottom: 5
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addBudgetText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  progressBarsContainer: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  progressBarSection: {
    width: '100%',
    marginBottom: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginBottom: 5,
  },
  progressLabel: {
    fontSize: 15,
    color: '#666',
    marginRight: 10
  },
  progressBackground: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 30,
    paddingBottom: 10,
  },
  currencySymbol: {
    fontSize: 24,
    marginRight: 10,
  },
  budgetInput: {
    flex: 1,
    fontSize: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#add8e6',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
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
});