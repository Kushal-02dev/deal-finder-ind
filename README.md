# PriceCompare India 🛍️

A modern price comparison platform for Indian e-commerce sites. Find the best deals across Amazon, Flipkart, Myntra, Snapdeal, and more - all in one place!

## ✨ Features

- **Real-Time Price Comparison** - Compare prices across multiple e-commerce platforms instantly
- **Best Deal Highlighting** - Automatically identifies and highlights the lowest price
- **Smart Search** - Search for any product and get instant results
- **Savings Calculator** - Shows how much you can save by choosing the best deal
- **Price Visualization** - Visual comparison bars to easily see price differences
- **Beautiful UI/UX** - Modern, responsive design with smooth animations
- **Mobile-First** - Works perfectly on all devices

## 🏗️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Lovable Cloud (Supabase Edge Functions)
- **Deployment**: Lovable Platform

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Lovable account (for backend functionality)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd pricecompare-india

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 🔧 How It Works

### Architecture

1. **Frontend (React)**: User searches for a product
2. **Edge Function**: Backend scrapes/fetches prices from multiple e-commerce sites
3. **Comparison Engine**: Analyzes results and identifies best deals
4. **UI**: Displays results with visual comparisons and highlights

### Web Scraping

**Note**: This project currently uses demo data for demonstration purposes. 

For production use with real price data, you would need:

1. **Official API Access**: 
   - Amazon Product Advertising API
   - Flipkart Affiliate API
   - Other affiliate program APIs

2. **Proper Web Scraping Infrastructure**:
   - Rotating proxies to avoid rate limits
   - Respect `robots.txt` and site terms of service
   - Implement proper rate limiting
   - Handle CAPTCHAs and anti-bot measures

3. **Legal Considerations**:
   - Review each site's Terms of Service
   - Join affiliate programs for proper access
   - Ensure compliance with data protection laws

### Backend Function

The price scraping logic is in `supabase/functions/scrape-prices/index.ts`. The function:
- Accepts a search query
- Generates/fetches price data from multiple sources
- Returns structured results with prices, ratings, and availability

## 🎨 Design System

The app uses a custom design system with:

- **Trust Blue** (#0080FF) - Primary brand color for reliability
- **Deal Orange** (#FF9500) - Accent color for deals and savings
- **Modern Gradients** - Smooth color transitions
- **Card-based Layout** - Clean, organized information display
- **Smooth Animations** - Fade-ins and hover effects

## 📱 Pages

- **Home/Search** (`/`) - Main search interface with hero section
- **404** (`/404`) - Error page for non-existent routes

## 🛠️ Development

### Key Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── SearchBar.tsx  # Search input component
│   ├── PriceCard.tsx  # Individual price display
│   └── ComparisonResults.tsx  # Results grid
├── pages/             # Page components
│   ├── Index.tsx      # Home page
│   └── NotFound.tsx   # 404 page
├── assets/            # Static assets (images)
└── integrations/      # Supabase client

supabase/
└── functions/         # Edge functions
    └── scrape-prices/ # Price scraping function
```

## 🔐 Environment Variables

Backend functions automatically have access to:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

No manual configuration needed when using Lovable Cloud!

## 📈 Future Enhancements

- [ ] Price history tracking and charts
- [ ] User accounts and saved searches
- [ ] Price alerts and notifications
- [ ] Product reviews aggregation
- [ ] Wishlist functionality
- [ ] Real-time price updates
- [ ] Browser extension
- [ ] Mobile apps

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes. Please ensure you have proper API access and comply with all e-commerce sites' terms of service before deploying for production use.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## ⚠️ Disclaimer

This is a demonstration project. The current implementation uses sample data for demonstration purposes. For production use with real price data, you must:

1. Obtain proper API access from e-commerce platforms
2. Join affiliate programs where required
3. Comply with all applicable terms of service
4. Ensure legal compliance with data scraping laws in your jurisdiction

---

**Made with ❤️ for smart shoppers in India**
