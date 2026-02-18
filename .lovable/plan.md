

# Add VerifyMe Showcase Page

## Overview
Create a new showcase page for VerifyMe (Nasdaq: VRME) at `/showcase/verifyme`, following the OpenWorld showcase page pattern -- black background, transparent white-bordered cards, hero with background image, animated orbs, and colorful icon-accented sections.

## What will be built

### 1. New Page: `src/pages/VerifyMeShowcase.tsx`
A full showcase page modeled after OpenWorld's structure with VerifyMe-specific content:

- **Hero Section**: Badge "Public Company -- Nasdaq: VRME", company name, subtitle "Logistics & Security Solutions", description about VerifyMe's authentication and brand protection technology. Two CTA buttons: "Visit Website" (links to https://verifyme.com) and "AmplifiX Research" (Bing Copilot search link).
- **About Section**: Company overview covering their patented authentication technologies, supply chain traceability, and anti-counterfeiting solutions. Sidebar with company details (Website, Industry: Logistics & Security, Ticker: NASDAQ: VRME, Founded year).
- **Market Stats**: Key metrics related to VerifyMe's impact (e.g., counterfeit market size, products authenticated, supply chain visibility improvement).
- **Core Solutions Section**: Cards for their key product areas -- Authentication Technologies, Supply Chain Traceability, Brand Protection, Serialization & Track-and-Trace, Anti-Counterfeiting, Compliance Solutions -- each with colored icons matching OpenWorld's style.
- **Benefits Section**: Key advantages like Enhanced Security, Global Traceability, Regulatory Compliance, Cost Savings, Brand Protection, Real-Time Visibility.
- **How It Works Section**: Step-by-step process (Product Registration, Authentication Integration, Supply Chain Tracking, Verification & Reporting).
- **Technology Stack Section**: 3-card grid (Patented Technology, Cloud Platform, Enterprise Integration).
- **Use Cases Section**: Industry applications (Pharmaceuticals, Consumer Goods, Government/Defense, Cannabis Compliance).
- **CTA Section**: Dark gradient background with "Partner with VerifyMe" heading and buttons to visit website and AmplifiX Research.

### 2. Route Registration in `src/App.tsx`
- Import `VerifyMeShowcase` component
- Add route: `/showcase/verifyme`

### 3. Database Record
- Add VerifyMe to `showcase_companies` table via the showcase admin or inline insert:
  - company_name: "VerifyMe"
  - ticker: "VRME"
  - subtitle: "NAS:VRME"
  - type: "stock"
  - main_sector: "LOGISTICS & SECURITY"
  - tags: ["Logistics", "Security", "Authentication"]
  - link: "/showcase/verifyme"
  - website: "https://verifyme.com"
  - stock_url: "https://www.tradingview.com/symbols/NASDAQ-VRME/"
  - search_url: "https://www.bing.com/copilotsearch?q=VerifyMe+NASDAQ+VRME"
  - button_text: "View Showcase"
  - thumbnail: AmplifiX search link for the thumbnail button
  - disabled: false

## Design Details

- **Theme**: Black background (`bg-black text-white`), transparent cards with `border-white/20`, matching OpenWorld exactly
- **Color accents**: Blue for primary, green for security, purple for technology, orange for supply chain, amber for authentication
- **Animations**: Glowing orb pulses, hover scale effects on cards, grid background pattern
- **SEO**: Full Helmet meta tags for title, description, OG and Twitter cards
- **Translation**: `useGTranslateRefresh(true)` hook included

## Files to create/modify
1. **Create**: `src/pages/VerifyMeShowcase.tsx` (approx 800 lines, following OpenWorld template)
2. **Modify**: `src/App.tsx` -- add import and route

