import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackButton from '../components/backButton'
import { fetchExchangeRates } from '../services/currencyService'
import { useDispatch } from 'react-redux'
import { setTargetCurrency } from '../store/currencySlice'
import { useTheme } from '../hooks/useTheme'
import { ThemedView } from '../components/ThemedView'

const CURRENCIES = [
    { flag: '🇪🇺', name: 'Euro', country: 'Europe', code: 'EUR' },
    { flag: '🇺🇸', name: 'US Dollar', country: 'United States', code: 'USD' },
    { flag: '🇨🇦', name: 'Canadian Dollar', country: 'Canada', code: 'CAD' },
    { flag: '🇦🇺', name: 'Australian Dollar', country: 'Australia', code: 'AUD' },
    { flag: '🇮🇳', name: 'Indian Rupee', country: 'India', code: 'INR' },
]

const ALL_CURRENCIES = [
    { flag: '🇦🇫', name: 'Afghan Afghani', country: 'Afghanistan', code: 'AFN' },
    { flag: '🇦🇱', name: 'Albanian Lek', country: 'Albania', code: 'ALL' },
    { flag: '🇩🇿', name: 'Algerian Dinar', country: 'Algeria', code: 'DZD' },
]

export default function CurrencyScreen() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const theme = useTheme();

    useEffect(() => {
        loadExchangeRates();
    }, []);

    const loadExchangeRates = async () => {
        try {
            const data = await fetchExchangeRates('INR');
            setRates(data.conversion_rates);
            setLoading(false);
        } catch (error) {
            console.error('Error loading rates:', error);
            setLoading(false);
        }
    };

    const handleCurrencySelect = (currencyCode: string) => {
        const rate = rates[currencyCode];
        const symbol = currencyCode === 'USD' ? '$' :
            currencyCode === 'EUR' ? '€' :
                currencyCode === 'INR' ? '₹' :
                    currencyCode === 'GBP' ? '£' : '$';

        dispatch(setTargetCurrency({
            id: currencyCode,
            symbol,
            rate: rate
        }));
    };

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <BackButton />
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        CHANGE CURRENCY
                    </Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </ThemedView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <BackButton />
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        CHANGE CURRENCY
                    </Text>
                </View>

                <ScrollView style={styles.content}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.grey }]}>
                        Most used
                    </Text>
                    <View style={[styles.currencyList, { 
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border 
                    }]}>
                        {CURRENCIES.map((currency, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.currencyItem, { 
                                    borderBottomColor: theme.colors.border,
                                    backgroundColor: theme.colors.card 
                                }]}
                                onPress={() => handleCurrencySelect(currency.code)}
                            >
                                <View style={styles.currencyInfo}>
                                    <Text style={styles.flag}>{currency.flag}</Text>
                                    <View>
                                        <Text style={[styles.currencyName, { color: theme.colors.text }]}>
                                            {currency.name}
                                        </Text>
                                        <Text style={[styles.countryName, { color: theme.colors.grey }]}>
                                            {currency.country}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.rateContainer}>
                                    <Text style={[styles.currencyCode, { color: theme.colors.grey }]}>
                                        {currency.code}
                                    </Text>
                                    <Text style={[styles.exchangeRate, { color: theme.colors.grey }]}>
                                        {rates[currency.code]?.toFixed(4)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.sectionTitle, { color: theme.colors.grey }]}>
                        All currencies
                    </Text>
                    <View style={[styles.currencyList, { 
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border 
                    }]}>
                        {ALL_CURRENCIES.map((currency, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.currencyItem, { 
                                    borderBottomColor: theme.colors.border,
                                    backgroundColor: theme.colors.card 
                                }]}
                            >
                                <View style={styles.currencyInfo}>
                                    <Text style={styles.flag}>{currency.flag}</Text>
                                    <View>
                                        <Text style={[styles.currencyName, { color: theme.colors.text }]}>
                                            {currency.name}
                                        </Text>
                                        <Text style={[styles.countryName, { color: theme.colors.grey }]}>
                                            {currency.country}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.currencyCode, { color: theme.colors.grey }]}>
                                    {currency.code}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: '20%',
    },
    menuButton: {
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchIcon: {
        marginRight: 8,
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#666',
        marginTop: 20,
        marginBottom: 12,
    },
    currencyList: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
    },
    currencyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        fontSize: 24,
        marginRight: 12,
    },
    currencyName: {
        fontSize: 16,
        fontWeight: '500',
    },
    countryName: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    currencyCode: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rateContainer: {
        alignItems: 'flex-end'
    },
    exchangeRate: {
        fontSize: 12,
        color: '#666',
        marginTop: 4
    }
})