import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface ExpenseProps {
  expense: {
    title: string;
    category: string;
    amount: number;
  }
}

export default function ExpenseCard({ expense }: ExpenseProps) {
  const { currency } = useSelector((state: RootState) => state.currency);
  const convertAmount = (amount: number): string => {
    const convertedAmount = amount * currency.rate;
    return convertedAmount.toFixed(2); // Round to two decimal places
  } 
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.category}>{expense.category}</Text>
        </View>
        <Text style={styles.amount}>{currency.symbol}{convertAmount(expense.amount)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  category: {
    color: 'grey',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  }
})