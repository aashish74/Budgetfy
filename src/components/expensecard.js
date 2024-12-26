import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ExpenseCard({ expense }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.category}>{expense.category}</Text>
        </View>
        <Text style={styles.amount}>₹{expense.amount}</Text>
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