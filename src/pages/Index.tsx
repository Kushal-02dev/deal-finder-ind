import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ComparisonResults } from "@/components/ComparisonResults";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PriceData } from "@/components/PriceCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const POPULAR_SEARCHES = [
  "iPhone 15",
  "Samsung Galaxy S24",
  "Sony WH-1000XM5",
  "Nike Air Max",
  "MacBook Pro",
  "PS5",
];

const Index = () => {
  const [results, setResults] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-prices', {
        body: { query }
      });

      if (error) throw error;

      if (data && data.results && data.results.length > 0) {
        setResults(data.results);
        toast.success(`Found ${data.results.length} offers for "${query}"`);
      } else {
        toast.info("No results found. Try a different search term.");
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Failed to search prices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Smart Price Comparison</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find the <span className="text-primary">Best Deals</span> Across India
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare prices instantly from Amazon and Flipkart. 
              Save money with smart shopping decisions.
            </p>

            <div className="pt-4">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Popular Searches */}
            {!isLoading && results.length === 0 && (
              <div className="pt-6 animate-fade-in">
                <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {POPULAR_SEARCHES.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(search)}
                      className="transition-all hover:scale-105"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="flex flex-col items-center text-center p-6 bg-card/50 backdrop-blur rounded-lg border border-border">
              <div className="p-3 bg-primary/10 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-Time Prices</h3>
              <p className="text-sm text-muted-foreground">
                Get up-to-date pricing from all major e-commerce platforms
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card/50 backdrop-blur rounded-lg border border-border">
              <div className="p-3 bg-accent/10 rounded-lg mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Instant Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare prices across multiple sites in seconds
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card/50 backdrop-blur rounded-lg border border-border">
              <div className="p-3 bg-secondary/10 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Best Deal Guaranteed</h3>
              <p className="text-sm text-muted-foreground">
                We highlight the lowest price so you never overpay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        {isLoading && <LoadingSkeleton />}
        {!isLoading && results.length > 0 && (
          <ComparisonResults results={results} productName={searchQuery} />
        )}
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>Compare prices from Amazon.in and Flipkart</p>
          <p className="mt-2">Built with ❤️ for smart shoppers in India</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
