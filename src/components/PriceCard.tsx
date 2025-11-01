import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingDown, Star } from "lucide-react";

export interface PriceData {
  site: string;
  price: number;
  originalPrice?: number;
  url: string;
  rating?: number;
  availability: string;
  logo?: string;
}

interface PriceCardProps {
  data: PriceData;
  isBestDeal?: boolean;
}

export const PriceCard = ({ data, isBestDeal }: PriceCardProps) => {
  const savings = data.originalPrice ? data.originalPrice - data.price : 0;
  const savingsPercent = data.originalPrice 
    ? Math.round((savings / data.originalPrice) * 100) 
    : 0;

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] 
        ${isBestDeal ? 'border-accent border-2 shadow-[var(--shadow-deal)]' : ''}
        hover:scale-[1.02]
      `}
    >
      {isBestDeal && (
        <div className="absolute top-0 right-0 z-10">
          <Badge variant="deal" className="rounded-tl-none rounded-br-none">
            <TrendingDown className="mr-1 h-3 w-3" />
            Best Deal
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-bold text-xl">
              {data.site.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{data.site}</h3>
              {data.rating && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span>{data.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              ₹{data.price.toLocaleString('en-IN')}
            </span>
            {data.originalPrice && data.originalPrice > data.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{data.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {savings > 0 && (
            <Badge variant="secondary" className="mt-2">
              Save ₹{savings.toLocaleString('en-IN')} ({savingsPercent}% off)
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Availability:</span>
          <span className={`font-medium ${data.availability === 'In Stock' ? 'text-green-600' : 'text-yellow-600'}`}>
            {data.availability}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          variant={isBestDeal ? "deal" : "default"}
          className="w-full"
          onClick={() => window.open(data.url, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on {data.site}
        </Button>
      </CardFooter>
    </Card>
  );
};
