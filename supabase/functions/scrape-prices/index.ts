import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Price scraping request for:', query);

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Note: Real web scraping of e-commerce sites is complex and often blocked.
    // This is a demo implementation showing the structure.
    // For production, you would need:
    // 1. API access from e-commerce platforms
    // 2. Proper scraping infrastructure with rotating proxies
    // 3. Respect robots.txt and rate limits
    // 4. Use official affiliate APIs when available

    // Generate demo data for demonstration
    const results = generateDemoResults(query);

    console.log(`Generated ${results.length} demo results for: ${query}`);

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in scrape-prices function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Demo data generator
function generateDemoResults(query: string) {
  const sites = [
    { name: 'Amazon.in', url: 'https://amazon.in', ratingRange: [4.0, 4.8] },
    { name: 'Flipkart', url: 'https://flipkart.com', ratingRange: [3.8, 4.6] },
    { name: 'Myntra', url: 'https://myntra.com', ratingRange: [4.2, 4.7] },
    { name: 'Snapdeal', url: 'https://snapdeal.com', ratingRange: [3.5, 4.3] },
    { name: 'Ajio', url: 'https://ajio.com', ratingRange: [4.0, 4.5] },
  ];

  // Generate random but realistic-looking prices
  const basePrice = Math.floor(Math.random() * 50000) + 5000;
  
  return sites.map((site, index) => {
    // Add variance to prices
    const priceVariance = Math.random() * 0.3 - 0.15; // -15% to +15%
    const price = Math.floor(basePrice * (1 + priceVariance));
    
    // Sometimes add original price for discounts
    const hasDiscount = Math.random() > 0.4;
    const originalPrice = hasDiscount 
      ? Math.floor(price * (1 + Math.random() * 0.3 + 0.1)) // 10-40% discount
      : undefined;

    const [minRating, maxRating] = site.ratingRange;
    const rating = Number((Math.random() * (maxRating - minRating) + minRating).toFixed(1));

    const availability = Math.random() > 0.2 ? 'In Stock' : 'Limited Stock';

    return {
      site: site.name,
      price,
      originalPrice,
      url: `${site.url}/search?q=${encodeURIComponent(query)}`,
      rating,
      availability,
    };
  });
}
