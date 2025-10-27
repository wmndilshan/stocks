'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink } from 'lucide-react';
import { getNews } from '@/lib/actions/finnhub.actions';

interface MarketNewsProps {
  symbols?: string[];
  maxArticles?: number;
}

export default function MarketNews({ symbols, maxArticles = 6 }: MarketNewsProps) {
  const [news, setNews] = useState<MarketNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const articles = await getNews(symbols);
        setNews(articles.slice(0, maxArticles));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbols, maxArticles]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Market News
          <Badge variant="outline">{news.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.length === 0 ? (
            <p className="text-muted-foreground">No news available</p>
          ) : (
            news.map((article, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                      {article.headline}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(article.datetime * 1000).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{article.source}</span>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                      >
                        Read more
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
