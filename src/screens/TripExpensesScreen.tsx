import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import randomImage from '../assets/randomImage';
import EmptyList from '../components/emptyList';
import BackButton from '../components/backButton';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import ExpenseCard from '../components/expensecard';
import { useSelector } from 'react-redux';
import { selectExpensesByTripId } from '../store/selectors';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackNavigationProp<RootStackParamList, 'TripExpenses'>;

export default function TripExpensesScreen() {
    const navigation = useNavigation<Props>();
    const route = useRoute();
    const { place, country, id: tripId } = route.params as { place: string; country: string; id: string };
    const expenses = useSelector(selectExpensesByTripId(tripId));

    const handleAddExpense = () => {
        navigation.navigate('AddExpenses', { tripId });
    };

    return (
        <SafeAreaView>
            <View style={{ backgroundColor: '#fff', paddingHorizontal: 15 }}>
                <View style={{ position: 'absolute', zIndex: 1, top: 10, left: 6 }}>
                    <BackButton />
                </View>
                <View style={{ paddingTop: 4, marginBottom: 20 }}>
                    <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 24 }}>{place}</Text>
                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 16 }}>{country}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={{ height: 400, width: 400 }}
                        source={randomImage()} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '600' }}>Expenses</Text>
                    <TouchableOpacity
                        onPress={handleAddExpense}
                        style={{ padding: 10, paddingHorizontal: 15, backgroundColor: 'white', borderWidth: 0.2, borderColor: 'grey', borderRadius: 20 }}>
                        <Text style={{ color: 'grey', fontWeight: '600' }}>Add Expense</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 500 }}>
                    <FlatList
                        data={expenses}
                        ListEmptyComponent={<EmptyList />}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ExpenseCard expense={item} />
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})