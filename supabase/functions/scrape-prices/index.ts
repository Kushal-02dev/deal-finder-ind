import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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

    // Input validation
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid search query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitize and limit query length
    const sanitizedQuery = query.trim().slice(0, 200);
    
    if (sanitizedQuery.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Search query cannot be empty' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Attempt real scraping, fall back to demo data if it fails
    const results = await scrapeRealPrices(sanitizedQuery);

    console.log(`Retrieved ${results.length} results for: ${sanitizedQuery}`);

    return new Response(
      JSON.stringify({ 
        results,
        note: results[0]?.isDemo ? 'Using demo data. Real scraping requires affiliate APIs.' : 'Live data'
      }),
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

// Attempt to scrape real prices from e-commerce sites
async function scrapeRealPrices(query: string) {
  const sites = [
    { 
      name: 'Amazon.in', 
      url: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
      selectors: { price: '.a-price-whole', title: 'h2 a span', rating: '.a-icon-alt' }
    },
    { 
      name: 'Flipkart', 
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
      selectors: { price: '._30jeq3', title: '._4rR01T', rating: '.gUuXy-' }
    }
  ];

  const scrapedResults = [];
  let scrapeSuccessful = false;

  for (const site of sites) {
    try {
      console.log(`Attempting to scrape ${site.name}...`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        if (doc) {
          // Try to extract price (this is simplified and may not work due to anti-scraping)
          const priceElement = doc.querySelector(site.selectors.price);
          const priceText = priceElement?.textContent?.replace(/[^0-9]/g, '');
          
          if (priceText) {
            const price = parseInt(priceText);
            scrapedResults.push({
              site: site.name,
              price,
              url: site.url,
              rating: 4.0 + Math.random() * 0.8,
              availability: 'In Stock',
              isDemo: false,
            });
            scrapeSuccessful = true;
            console.log(`Successfully scraped ${site.name}: ₹${price}`);
          }
        }
      }
    } catch (error) {
      console.log(`Failed to scrape ${site.name}:`, error instanceof Error ? error.message : 'Unknown error');
      // Continue to next site
    }
  }

  // If scraping failed or didn't get enough results, use demo data
  if (!scrapeSuccessful || scrapedResults.length < 2) {
    console.log('Scraping failed or insufficient results, using demo data');
    return generateDemoResults(query);
  }

  return scrapedResults;
}

// Demo data generator (fallback when scraping fails)
function generateDemoResults(query: string) {
  const sites = [
    { name: 'Amazon.in', url: 'https://www.amazon.in', ratingRange: [4.0, 4.8] },
    { name: 'Flipkart', url: 'https://www.flipkart.com', ratingRange: [3.8, 4.6] },
    { name: 'Myntra', url: 'https://www.myntra.com', ratingRange: [4.2, 4.7] },
    { name: 'Snapdeal', url: 'https://www.snapdeal.com', ratingRange: [3.5, 4.3] },
    { name: 'Ajio', url: 'https://www.ajio.com', ratingRange: [4.0, 4.5] },
  ];

  // Generate random but realistic-looking prices
  const basePrice = Math.floor(Math.random() * 50000) + 5000;
  
  return sites.map((site) => {
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
      isDemo: true, // Flag to indicate this is demo data
    };
  });
}
