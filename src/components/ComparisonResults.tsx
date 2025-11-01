import { PriceCard, PriceData } from "./PriceCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Package } from "lucide-react";

interface ComparisonResultsProps {
  results: PriceData[];
  productName: string;
}

export const ComparisonResults = ({ results, productName }: ComparisonResultsProps) => {
  if (results.length === 0) return null;

  const sortedResults = [...results].sort((a, b) => a.price - b.price);
  const bestDeal = sortedResults[0];
  const avgPrice = sortedResults.reduce((sum, item) => sum + item.price, 0) / sortedResults.length;
  const maxSavings = sortedResults[sortedResults.length - 1].price - bestDeal.price;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-card rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{productName}</h2>
                <p className="text-muted-foreground">
                  Found {results.length} offers from top Indian e-commerce sites
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="text-base px-4 py-2">
                <TrendingDown className="mr-2 h-4 w-4" />
                Save up to ₹{maxSavings.toLocaleString('en-IN')}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Avg. Price: ₹{Math.round(avgPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResults.map((result, index) => (
          <PriceCard
            key={`${result.site}-${index}`}
            data={result}
            isBestDeal={result.site === bestDeal.site && result.price === bestDeal.price}
          />
        ))}
      </div>

      {/* Price Comparison Bar */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Price Comparison</h3>
          <div className="space-y-3">
            {sortedResults.map((result, index) => {
              const maxPrice = sortedResults[sortedResults.length - 1].price;
              const percentage = (result.price / maxPrice) * 100;
              
              return (
                <div key={`${result.site}-bar-${index}`} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{result.site}</span>
                    <span className="text-muted-foreground">₹{result.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-accent to-secondary' 
                          : 'bg-primary'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
