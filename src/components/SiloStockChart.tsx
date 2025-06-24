
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mock stock data - in a real application, this would come from a financial API
const generateMockStockData = () => {
  const data = [];
  const basePrice = 2.45; // Approximate SILO stock price
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const randomChange = (Math.random() - 0.5) * 0.2;
    const price = Math.max(0.1, basePrice + randomChange);
    
    data.push({
      date: date.toLocaleDateString(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 100000) + 50000
    });
  }
  
  return data;
};

const SiloStockChart = () => {
  const stockData = generateMockStockData();
  const currentPrice = stockData[stockData.length - 1]?.price || 2.45;
  const previousPrice = stockData[stockData.length - 2]?.price || 2.40;
  const priceChange = currentPrice - previousPrice;
  const percentChange = ((priceChange / previousPrice) * 100);
  const isPositive = priceChange >= 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">SILO Pharma Inc. (NASDAQ: SILO)</CardTitle>
            <CardDescription>Real-time stock performance</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${currentPrice.toFixed(2)}</div>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip 
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Volume</div>
            <div className="font-medium">{stockData[stockData.length - 1]?.volume.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Market Cap</div>
            <div className="font-medium">$24.5M</div>
          </div>
          <div>
            <div className="text-muted-foreground">52W High</div>
            <div className="font-medium">$4.20</div>
          </div>
          <div>
            <div className="text-muted-foreground">52W Low</div>
            <div className="font-medium">$1.85</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiloStockChart;
