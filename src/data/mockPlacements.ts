export interface PlacementOffer {
  id: string;
  universityId: string;
  universityName: string;
  country: string;
  companyName: string;
  role: string;
  offerType: "intern" | "full-time";
  ctcMin: number;
  ctcMax: number;
  currency: string;
  location: string;
  batchYear: number;
}

export interface CountryCTCBenchmark {
  country: string;
  countryName: string;
  currency: string;
  medianCTC: number;
  averageCTC: number;
}

export const countryCTCBenchmarks: CountryCTCBenchmark[] = [
  { country: "us", countryName: "United States", currency: "USD", medianCTC: 95000, averageCTC: 102000 },
  { country: "uk", countryName: "United Kingdom", currency: "GBP", medianCTC: 42000, averageCTC: 46000 },
  { country: "canada", countryName: "Canada", currency: "CAD", medianCTC: 72000, averageCTC: 76000 },
  { country: "germany", countryName: "Germany", currency: "EUR", medianCTC: 55000, averageCTC: 59000 },
  { country: "australia", countryName: "Australia", currency: "AUD", medianCTC: 80000, averageCTC: 86000 },
  { country: "newzealand", countryName: "New Zealand", currency: "NZD", medianCTC: 72000, averageCTC: 76000 },
];

export const mockPlacementOffers: PlacementOffer[] = [
  // MIT placements
  { id: "p1", universityId: "mit", universityName: "MIT", country: "us", companyName: "Google", role: "Software Engineer", offerType: "full-time", ctcMin: 180000, ctcMax: 220000, currency: "USD", location: "Mountain View, CA", batchYear: 2024 },
  { id: "p2", universityId: "mit", universityName: "MIT", country: "us", companyName: "Apple", role: "ML Engineer", offerType: "full-time", ctcMin: 170000, ctcMax: 210000, currency: "USD", location: "Cupertino, CA", batchYear: 2024 },
  { id: "p3", universityId: "mit", universityName: "MIT", country: "us", companyName: "Amazon", role: "Senior SDE", offerType: "full-time", ctcMin: 160000, ctcMax: 200000, currency: "USD", location: "Seattle, WA", batchYear: 2024 },
  { id: "p4", universityId: "mit", universityName: "MIT", country: "us", companyName: "Goldman Sachs", role: "Quantitative Analyst", offerType: "full-time", ctcMin: 175000, ctcMax: 225000, currency: "USD", location: "New York, NY", batchYear: 2023 },
  { id: "p5", universityId: "mit", universityName: "MIT", country: "us", companyName: "Google", role: "SWE Intern", offerType: "intern", ctcMin: 45000, ctcMax: 55000, currency: "USD", location: "Remote", batchYear: 2024 },
  { id: "p6", universityId: "mit", universityName: "MIT", country: "us", companyName: "Microsoft", role: "Product Manager", offerType: "full-time", ctcMin: 155000, ctcMax: 195000, currency: "USD", location: "Redmond, WA", batchYear: 2024 },

  // Stanford placements
  { id: "p7", universityId: "stanford", universityName: "Stanford University", country: "us", companyName: "Meta", role: "Software Engineer", offerType: "full-time", ctcMin: 175000, ctcMax: 215000, currency: "USD", location: "Menlo Park, CA", batchYear: 2024 },
  { id: "p8", universityId: "stanford", universityName: "Stanford University", country: "us", companyName: "Tesla", role: "Data Scientist", offerType: "full-time", ctcMin: 145000, ctcMax: 185000, currency: "USD", location: "Austin, TX", batchYear: 2024 },
  { id: "p9", universityId: "stanford", universityName: "Stanford University", country: "us", companyName: "McKinsey", role: "Business Analyst", offerType: "full-time", ctcMin: 165000, ctcMax: 200000, currency: "USD", location: "New York, NY", batchYear: 2023 },
  { id: "p10", universityId: "stanford", universityName: "Stanford University", country: "us", companyName: "Apple", role: "iOS Engineer", offerType: "full-time", ctcMin: 160000, ctcMax: 200000, currency: "USD", location: "Cupertino, CA", batchYear: 2024 },

  // Harvard placements
  { id: "p11", universityId: "harvard", universityName: "Harvard University", country: "us", companyName: "McKinsey", role: "Associate Consultant", offerType: "full-time", ctcMin: 165000, ctcMax: 200000, currency: "USD", location: "New York, NY", batchYear: 2024 },
  { id: "p12", universityId: "harvard", universityName: "Harvard University", country: "us", companyName: "Goldman Sachs", role: "Investment Banking Analyst", offerType: "full-time", ctcMin: 150000, ctcMax: 200000, currency: "USD", location: "New York, NY", batchYear: 2024 },
  { id: "p13", universityId: "harvard", universityName: "Harvard University", country: "us", companyName: "Google", role: "Strategy & Operations", offerType: "full-time", ctcMin: 140000, ctcMax: 175000, currency: "USD", location: "Mountain View, CA", batchYear: 2023 },
  { id: "p14", universityId: "harvard", universityName: "Harvard University", country: "us", companyName: "BCG", role: "Consultant", offerType: "full-time", ctcMin: 160000, ctcMax: 195000, currency: "USD", location: "Boston, MA", batchYear: 2024 },

  // UC Berkeley placements  
  { id: "p15", universityId: "ucberkeley", universityName: "UC Berkeley", country: "us", companyName: "Google", role: "Software Engineer", offerType: "full-time", ctcMin: 155000, ctcMax: 195000, currency: "USD", location: "Mountain View, CA", batchYear: 2024 },
  { id: "p16", universityId: "ucberkeley", universityName: "UC Berkeley", country: "us", companyName: "Salesforce", role: "Full Stack Engineer", offerType: "full-time", ctcMin: 135000, ctcMax: 170000, currency: "USD", location: "San Francisco, CA", batchYear: 2024 },
  { id: "p17", universityId: "ucberkeley", universityName: "UC Berkeley", country: "us", companyName: "Apple", role: "SWE Intern", offerType: "intern", ctcMin: 40000, ctcMax: 50000, currency: "USD", location: "Cupertino, CA", batchYear: 2024 },

  // UCLA placements
  { id: "p18", universityId: "ucla", universityName: "UCLA", country: "us", companyName: "Disney", role: "UX Engineer", offerType: "full-time", ctcMin: 120000, ctcMax: 155000, currency: "USD", location: "Burbank, CA", batchYear: 2024 },
  { id: "p19", universityId: "ucla", universityName: "UCLA", country: "us", companyName: "Amazon", role: "Software Development Engineer", offerType: "full-time", ctcMin: 140000, ctcMax: 175000, currency: "USD", location: "Los Angeles, CA", batchYear: 2024 },

  // Oxford placements
  { id: "p20", universityId: "oxford", universityName: "University of Oxford", country: "uk", companyName: "McKinsey", role: "Business Analyst", offerType: "full-time", ctcMin: 65000, ctcMax: 80000, currency: "GBP", location: "London, UK", batchYear: 2024 },
  { id: "p21", universityId: "oxford", universityName: "University of Oxford", country: "uk", companyName: "Goldman Sachs", role: "Analyst", offerType: "full-time", ctcMin: 70000, ctcMax: 90000, currency: "GBP", location: "London, UK", batchYear: 2024 },
  { id: "p22", universityId: "oxford", universityName: "University of Oxford", country: "uk", companyName: "Clifford Chance", role: "Trainee Solicitor", offerType: "full-time", ctcMin: 50000, ctcMax: 65000, currency: "GBP", location: "London, UK", batchYear: 2023 },
  { id: "p23", universityId: "oxford", universityName: "University of Oxford", country: "uk", companyName: "Google", role: "UX Researcher", offerType: "full-time", ctcMin: 60000, ctcMax: 75000, currency: "GBP", location: "London, UK", batchYear: 2024 },

  // Cambridge placements
  { id: "p24", universityId: "cambridge", universityName: "University of Cambridge", country: "uk", companyName: "ARM", role: "Chip Design Engineer", offerType: "full-time", ctcMin: 65000, ctcMax: 82000, currency: "GBP", location: "Cambridge, UK", batchYear: 2024 },
  { id: "p25", universityId: "cambridge", universityName: "University of Cambridge", country: "uk", companyName: "Google", role: "Software Engineer", offerType: "full-time", ctcMin: 75000, ctcMax: 95000, currency: "GBP", location: "London, UK", batchYear: 2024 },
  { id: "p26", universityId: "cambridge", universityName: "University of Cambridge", country: "uk", companyName: "McKinsey", role: "Junior Consultant", offerType: "full-time", ctcMin: 60000, ctcMax: 78000, currency: "GBP", location: "London, UK", batchYear: 2023 },

  // Imperial placements
  { id: "p27", universityId: "imperial", universityName: "Imperial College London", country: "uk", companyName: "JP Morgan", role: "Quantitative Developer", offerType: "full-time", ctcMin: 70000, ctcMax: 90000, currency: "GBP", location: "London, UK", batchYear: 2024 },
  { id: "p28", universityId: "imperial", universityName: "Imperial College London", country: "uk", companyName: "Amazon", role: "Software Engineer", offerType: "full-time", ctcMin: 65000, ctcMax: 82000, currency: "GBP", location: "London, UK", batchYear: 2024 },
  { id: "p29", universityId: "imperial", universityName: "Imperial College London", country: "uk", companyName: "Google", role: "SWE Intern", offerType: "intern", ctcMin: 20000, ctcMax: 28000, currency: "GBP", location: "London, UK", batchYear: 2024 },

  // University of Toronto placements
  { id: "p30", universityId: "toronto", universityName: "University of Toronto", country: "canada", companyName: "Google", role: "Software Engineer", offerType: "full-time", ctcMin: 110000, ctcMax: 145000, currency: "CAD", location: "Waterloo, ON", batchYear: 2024 },
  { id: "p31", universityId: "toronto", universityName: "University of Toronto", country: "canada", companyName: "Microsoft", role: "Cloud Engineer", offerType: "full-time", ctcMin: 100000, ctcMax: 135000, currency: "CAD", location: "Vancouver, BC", batchYear: 2024 },
  { id: "p32", universityId: "toronto", universityName: "University of Toronto", country: "canada", companyName: "RBC", role: "Data Analyst", offerType: "full-time", ctcMin: 75000, ctcMax: 100000, currency: "CAD", location: "Toronto, ON", batchYear: 2023 },

  // UBC placements
  { id: "p33", universityId: "ubc", universityName: "University of British Columbia", country: "canada", companyName: "Amazon", role: "SDE", offerType: "full-time", ctcMin: 105000, ctcMax: 140000, currency: "CAD", location: "Vancouver, BC", batchYear: 2024 },
  { id: "p34", universityId: "ubc", universityName: "University of British Columbia", country: "canada", companyName: "Hootsuite", role: "Full Stack Developer", offerType: "full-time", ctcMin: 82000, ctcMax: 110000, currency: "CAD", location: "Vancouver, BC", batchYear: 2024 },
];

/**
 * Get placement offers for a specific university.
 */
export function getPlacementsForUniversity(universityId: string): PlacementOffer[] {
  return mockPlacementOffers.filter((p) => p.universityId === universityId);
}

/**
 * Calculate median and average CTC for a university (full-time only).
 */
export function getUniversityCTCStats(universityId: string): {
  median: number;
  average: number;
  currency: string;
  count: number;
} {
  const offers = getPlacementsForUniversity(universityId).filter(
    (p) => p.offerType === "full-time"
  );

  if (offers.length === 0) {
    return { median: 0, average: 0, currency: "USD", count: 0 };
  }

  const midpoints = offers.map((o) => (o.ctcMin + o.ctcMax) / 2).sort((a, b) => a - b);
  const avg = midpoints.reduce((sum, v) => sum + v, 0) / midpoints.length;
  const mid = Math.floor(midpoints.length / 2);
  const median =
    midpoints.length % 2 === 0
      ? (midpoints[mid - 1] + midpoints[mid]) / 2
      : midpoints[mid];

  return {
    median: Math.round(median),
    average: Math.round(avg),
    currency: offers[0].currency,
    count: offers.length,
  };
}

/**
 * Get country benchmark for a specific country.
 */
export function getCountryBenchmark(country: string): CountryCTCBenchmark | undefined {
  return countryCTCBenchmarks.find((b) => b.country === country);
}

/**
 * Get unique companies for a university (for filter dropdown).
 */
export function getUniqueCompanies(universityId: string): string[] {
  const offers = getPlacementsForUniversity(universityId);
  return [...new Set(offers.map((o) => o.companyName))].sort();
}

/**
 * Filter placements by company and CTC range.
 */
export function filterPlacements(
  offers: PlacementOffer[],
  company?: string,
  ctcMin?: number,
  ctcMax?: number
): PlacementOffer[] {
  return offers.filter((o) => {
    const matchesCompany = !company || company === "all" || o.companyName === company;
    const matchesCTCMin = ctcMin === undefined || o.ctcMax >= ctcMin;
    const matchesCTCMax = ctcMax === undefined || o.ctcMin <= ctcMax;
    return matchesCompany && matchesCTCMin && matchesCTCMax;
  });
}
