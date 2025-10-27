'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface EconomicEvent {
  time: string;
  country: string;
  event: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  actual?: string;
  forecast?: string;
  previous?: string;
}

// Mock data - in a real app, this would come from an economic calendar API
const MOCK_EVENTS: EconomicEvent[] = [
  {
    time: '08:30',
    country: 'USD',
    event: 'Non-Farm Payrolls',
    impact: 'HIGH',
    forecast: '200K',
    previous: '180K'
  },
  {
    time: '10:00',
    country: 'USD',
    event: 'Unemployment Rate',
    impact: 'HIGH',
    forecast: '3.7%',
    previous: '3.8%'
  },
  {
    time: '14:00',
    country: 'EUR',
    event: 'ECB Interest Rate Decision',
    impact: 'HIGH',
    forecast: '4.00%',
    previous: '4.00%'
  },
  {
    time: '15:30',
    country: 'USD',
    event: 'Federal Reserve Speech',
    impact: 'MEDIUM',
    previous: 'Neutral'
  }
];

export default function EconomicCalendar() {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Economic Calendar
        </CardTitle>
        <p className="text-sm text-muted-foreground">{today}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_EVENTS.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="font-mono">{event.time}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm px-2 py-0.5 bg-gray-100 rounded text-xs">
                    {event.country}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getImpactColor(event.impact)}`}
                  >
                    {event.impact}
                  </Badge>
                </div>
                
                <div className="font-medium text-sm mb-1">{event.event}</div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {event.forecast && (
                    <div>
                      <span className="font-medium">Forecast:</span> {event.forecast}
                    </div>
                  )}
                  {event.previous && (
                    <div>
                      <span className="font-medium">Previous:</span> {event.previous}
                    </div>
                  )}
                  {event.actual && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium">Actual:</span> {event.actual}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Times shown in local timezone. High impact events may affect market volatility.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
