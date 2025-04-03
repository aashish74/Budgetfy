import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { PieChart } from 'react-native-gifted-charts';
import { useTheme } from '../hooks/useTheme';
import { ThemedView } from '../components/ThemedView';
import BackButton from '../components/backButton';

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.7;

export default function StatisticsScreen() {
    const theme = useTheme();
    const trips = useSelector((state: RootState) => state.trips.trips);
    const expenses = useSelector((state: RootState) => state.expenses);
    const { targetCurrency } = useSelector((state: RootState) => state.currency);
    const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

    // Calculate overall statistics
    const overallStats = useMemo(() => {
        const categoryTotals: { [key: string]: number } = {};
        
        Object.values(expenses).forEach(tripExpenses => {
            tripExpenses.forEach(expense => {
                const convertedAmount = expense.amount * targetCurrency.rate;
                categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + convertedAmount;
            });
        });

        const pieData = Object.entries(categoryTotals).map(([category, value], index) => ({
            value,
            text: `${((value / Object.values(categoryTotals).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`,
            color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'][index % 5],
            label: category,
        }));

        return {
            pieData,
            total: Object.values(categoryTotals).reduce((a, b) => a + b, 0)
        };
    }, [expenses, targetCurrency.rate]);

    // Calculate trip-specific statistics
    const getTripStats = (tripId: string) => {
        const tripExpenses = expenses[tripId] || [];
        const categoryTotals: { [key: string]: number } = {};

        tripExpenses.forEach(expense => {
            const convertedAmount = expense.amount * targetCurrency.rate;
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + convertedAmount;
        });

        const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
        
        const pieData = Object.entries(categoryTotals).map(([category, value], index) => ({
            value,
            text: `${((value / total) * 100).toFixed(1)}%`,
            color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'][index % 5],
            label: category,
        }));

        return { pieData, total };
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <BackButton />
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Statistics</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Overall Statistics */}
                <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overall Expenses</Text>
                    {overallStats.pieData.length > 0 ? (
                        <View style={styles.chartContainer}>
                            <PieChart
                                data={overallStats.pieData}
                                donut
                                showText
                                textColor={theme.colors.text}
                                radius={CHART_SIZE / 2}
                                innerRadius={CHART_SIZE / 4}
                                textSize={12}
                                centerLabelComponent={() => (
                                    <Text style={[styles.centerLabel, { color: '#000000' }]}>
                                        {targetCurrency.symbol}
                                        {overallStats.total.toFixed(2)}
                                    </Text>
                                )}
                            />
                            <View style={styles.legendContainer}>
                                {overallStats.pieData.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                        <Text style={[styles.legendText, { color: theme.colors.text }]}>
                                            {item.label}: {targetCurrency.symbol}
                                            {item.value.toFixed(2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <Text style={[styles.emptyText, { color: theme.colors.grey }]}>No expenses recorded</Text>
                    )}
                </View>

                {/* Trip-specific Statistics */}
                <View style={styles.tripsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trip Statistics</Text>
                    {trips.map(trip => (
                        <TouchableOpacity
                            key={trip.id}
                            style={[styles.tripCard, { backgroundColor: theme.colors.card }]}
                            onPress={() => setExpandedTripId(expandedTripId === trip.id ? null : trip.id)}
                        >
                            <Text style={[styles.tripTitle, { color: theme.colors.text }]}>{trip.place}</Text>
                            {expandedTripId === trip.id && (
                                <View style={styles.tripStats}>
                                    {getTripStats(trip.id).pieData.length > 0 ? (
                                        <>
                                            <PieChart
                                                data={getTripStats(trip.id).pieData}
                                                donut
                                                showText
                                                textColor={theme.colors.text}
                                                radius={(CHART_SIZE * 0.8) / 2}
                                                innerRadius={(CHART_SIZE * 0.8) / 4}
                                                textSize={12}
                                                centerLabelComponent={() => (
                                                    <Text style={[styles.centerLabel, { color: '#000000' }]}>
                                                        {targetCurrency.symbol}
                                                        {getTripStats(trip.id).total.toFixed(2)}
                                                    </Text>
                                                )}
                                            />
                                            <View style={styles.legendContainer}>
                                                {getTripStats(trip.id).pieData.map((item, index) => (
                                                    <View key={index} style={styles.legendItem}>
                                                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                                        <Text style={[styles.legendText, { color: theme.colors.text }]}>
                                                            {item.label}: {targetCurrency.symbol}
                                                            {item.value.toFixed(2)}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </>
                                    ) : (
                                        <Text style={[styles.emptyText, { color: theme.colors.grey }]}>No expenses recorded for this trip</Text>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginLeft: 20,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
    },
    centerLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    legendContainer: {
        marginTop: 20,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
    },
    legendText: {
        fontSize: 16,
    },
    tripsSection: {
        padding: 16,
    },
    tripCard: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tripTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    tripStats: {
        marginTop: 16,
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
});
