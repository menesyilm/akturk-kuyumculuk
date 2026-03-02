import { NextResponse } from 'next/server';

interface NosyApiItem {
  currencyCode: string;
  baseCurrencyCode: string;
  targetCurrencyCode: string;
  description: string;
  buy: number;
  sell: number;
  changeRate: number;
  dayHigh: number | null;
  dayLow: number | null;
  prevClose: number;
}

interface NosyApiResponse {
  status: string;
  data: NosyApiItem[];
  creditUsed?: number;
  rowCount?: number;
}

interface CurrencyData {
  buying: number;
  selling: number;
  change: number;
}

interface GoldPriceData {
  dolar: CurrencyData;
  euro: CurrencyData;
  gramAltin: CurrencyData;
  ingilizSterlini: CurrencyData;
  euroDolar: CurrencyData;
  onsAltin: CurrencyData;
  gumus: CurrencyData;
  altinGumus: CurrencyData;
}

export async function GET() {
  try {
    const apiKey = process.env.NOSY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Fetch exchange rates from NosyAPI
    const response = await fetch(
      `https://www.nosyapi.com/apiv2/service/economy/live-exchange-rates?apiKey=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nosy API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Nosy API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data: NosyApiResponse = await response.json();
    
    if (data.status !== 'success' || !data.data) {
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      );
    }

    // NosyAPI'den gelen verileri dönüştür
    const result: GoldPriceData = {
      dolar: { buying: 0, selling: 0, change: 0 },
      euro: { buying: 0, selling: 0, change: 0 },
      gramAltin: { buying: 0, selling: 0, change: 0 },
      ingilizSterlini: { buying: 0, selling: 0, change: 0 },
      euroDolar: { buying: 0, selling: 0, change: 0 },
      onsAltin: { buying: 0, selling: 0, change: 0 },
      gumus: { buying: 0, selling: 0, change: 0 },
      altinGumus: { buying: 0, selling: 0, change: 0 },
    };

    // API'den gelen verileri map et
    data.data.forEach((item) => {
      const currency: CurrencyData = {
        buying: item.buy,
        selling: item.sell,
        change: item.changeRate,
      };

      switch (item.currencyCode) {
        case 'USDTRY':
          result.dolar = currency;
          break;
        case 'EURTRY':
          result.euro = currency;
          break;
        case 'gramaltin':
          result.gramAltin = currency;
          break;
        case 'GBPTRY':
          result.ingilizSterlini = currency;
          break;
        case 'EURUSD':
          result.euroDolar = currency;
          break;
        case 'onstry':
          result.onsAltin = currency;
          break;
        case 'GUMUSTRY':
          result.gumus = currency;
          break;
        case 'ALTINGUMUS':
          result.altinGumus = currency;
          break;
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch gold prices', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
