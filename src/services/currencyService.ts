const API_KEY = 'c6ae6b8dabbfd3b50f2147af';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

export const fetchExchangeRates = async (baseCurrency: string): Promise<ExchangeRateResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}; 