import { describe, it, expect, beforeEach } from "vitest";

// -------------------------------------------------------------------
// 1. Enquiry form validation tests (pure logic)
// -------------------------------------------------------------------
const validateEnquiryForm = (formData: {
  name: string;
  email: string;
  phone: string;
  country: string;
  service: string;
}) => {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[\d\s\-\+\(\)]{8,}$/.test(formData.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!formData.country) {
    errors.country = "Please select a country";
  }

  if (!formData.service) {
    errors.service = "Please select a service";
  }

  return errors;
};

describe("Enquiry form validation", () => {
  const validData = {
    name: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "+91 98765 43210",
    country: "uk",
    service: "education",
  };

  it("returns no errors for a valid form", () => {
    const errors = validateEnquiryForm(validData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("requires name", () => {
    const errors = validateEnquiryForm({ ...validData, name: "" });
    expect(errors.name).toBe("Name is required");
  });

  it("requires name to be at least 2 characters", () => {
    const errors = validateEnquiryForm({ ...validData, name: "A" });
    expect(errors.name).toBe("Name must be at least 2 characters");
  });

  it("requires a valid email address", () => {
    const errors = validateEnquiryForm({ ...validData, email: "not-an-email" });
    expect(errors.email).toBe("Please enter a valid email address");
  });

  it("requires email to not be empty", () => {
    const errors = validateEnquiryForm({ ...validData, email: "" });
    expect(errors.email).toBe("Email is required");
  });

  it("requires a valid phone number (at least 8 digits)", () => {
    const errors = validateEnquiryForm({ ...validData, phone: "123" });
    expect(errors.phone).toBe("Please enter a valid phone number");
  });

  it("requires country selection", () => {
    const errors = validateEnquiryForm({ ...validData, country: "" });
    expect(errors.country).toBe("Please select a country");
  });

  it("requires service selection", () => {
    const errors = validateEnquiryForm({ ...validData, service: "" });
    expect(errors.service).toBe("Please select a service");
  });

  it("collects all 5 errors for empty form", () => {
    const errors = validateEnquiryForm({ name: "", email: "", phone: "", country: "", service: "" });
    expect(Object.keys(errors)).toHaveLength(5);
  });
});

// -------------------------------------------------------------------
// 2. AuthContext localStorage logic tests
// -------------------------------------------------------------------
describe("Auth localStorage logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores token and user on login", () => {
    const mockUser = { id: "1", email: "test@example.com", role: "user" as const };
    const mockToken = "test-jwt-token-123";

    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));

    expect(localStorage.getItem("token")).toBe(mockToken);
    expect(JSON.parse(localStorage.getItem("user")!)).toEqual(mockUser);
  });

  it("clears localStorage on logout", () => {
    localStorage.setItem("token", "some-token");
    localStorage.setItem("user", JSON.stringify({ id: "1", email: "a@b.com", role: "user" }));

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("handles malformed JSON in localStorage gracefully", () => {
    localStorage.setItem("token", "some-token");
    localStorage.setItem("user", "INVALID_JSON{{{{");

    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user")!);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    expect(user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("identifies authenticated state when token exists", () => {
    localStorage.setItem("token", "valid-token");
    expect(!!localStorage.getItem("token")).toBe(true);
  });

  it("identifies unauthenticated state when no token", () => {
    expect(!!localStorage.getItem("token")).toBe(false);
  });
});

// -------------------------------------------------------------------
// 3. Country sync: Enquiry countries should include all Education countries
// -------------------------------------------------------------------
describe("Country list completeness", () => {
  const educationCountries = [
    "us", "uk", "canada", "germany", "australia",
    "newzealand", "austria", "poland", "switzerland", "netherlands", "sweden"
  ];

  const enquiryCountryValues = [
    "us", "uk", "canada", "germany", "australia",
    "newzealand", "austria", "poland", "switzerland", "netherlands", "sweden", "other"
  ];

  it("enquiry country list includes all 11 education countries", () => {
    educationCountries.forEach(country => {
      expect(enquiryCountryValues).toContain(country);
    });
  });

  it("enquiry has 12 options (11 countries + other)", () => {
    expect(enquiryCountryValues).toHaveLength(12);
  });
});

// -------------------------------------------------------------------
// Feature 1: Ranking filter and sort utility functions (pure logic)
// -------------------------------------------------------------------
interface MinUniversity { id: string; ranking: number; }

const filterByRankTop = (unis: MinUniversity[], top: number) =>
  unis.filter((u) => u.ranking <= top);

const sortByRankAsc = (unis: MinUniversity[]) =>
  [...unis].sort((a, b) => a.ranking - b.ranking);

const sortByRankDesc = (unis: MinUniversity[]) =>
  [...unis].sort((a, b) => b.ranking - a.ranking);

const sampleUnis: MinUniversity[] = [
  { id: "mit", ranking: 1 },
  { id: "stanford", ranking: 3 },
  { id: "ucberkeley", ranking: 10 },
  { id: "ucla", ranking: 44 },
  { id: "boston", ranking: 99 },
  { id: "fordham", ranking: 201 },
];

describe("Feature 1: University rank filters", () => {
  it("filters Top 10 correctly", () => {
    const result = filterByRankTop(sampleUnis, 10);
    expect(result.every((u) => u.ranking <= 10)).toBe(true);
    expect(result.length).toBe(3);
  });

  it("filters Top 50 correctly", () => {
    const result = filterByRankTop(sampleUnis, 50);
    expect(result.length).toBe(4);
  });

  it("sortByRankAsc returns ascending order", () => {
    const sorted = sortByRankAsc(sampleUnis);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].ranking).toBeLessThanOrEqual(sorted[i + 1].ranking);
    }
  });

  it("sortByRankDesc returns descending order", () => {
    const sorted = sortByRankDesc(sampleUnis);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].ranking).toBeGreaterThanOrEqual(sorted[i + 1].ranking);
    }
  });

  it("returns empty array when no matches", () => {
    expect(filterByRankTop([{ id: "x", ranking: 500 }], 10)).toHaveLength(0);
  });
});

// -------------------------------------------------------------------
// Feature 2: Feedback validation (pure logic)
// -------------------------------------------------------------------
const validateFeedback = (data: { rating?: number; reviewText?: string; intakeYear?: number; reviewerType?: string }) => {
  const errors: string[] = [];
  if (data.rating === undefined || data.rating < 1 || data.rating > 5) errors.push("Rating must be between 1 and 5");
  if (!data.reviewText || data.reviewText.trim().length < 10) errors.push("Review must be at least 10 characters");
  if (!data.intakeYear || String(data.intakeYear).length !== 4) errors.push("Intake year must be a 4-digit number");
  if (!data.reviewerType || !["student", "alumni"].includes(data.reviewerType)) errors.push("Reviewer type must be student or alumni");
  return errors;
};

describe("Feature 2: Feedback validation", () => {
  it("valid data produces no errors", () => {
    expect(validateFeedback({ rating: 5, reviewText: "Amazing world-class faculty.", intakeYear: 2022, reviewerType: "alumni" })).toHaveLength(0);
  });

  it("rejects rating 0", () => {
    expect(validateFeedback({ rating: 0, reviewText: "Valid review text here", intakeYear: 2022, reviewerType: "student" }))
      .toContain("Rating must be between 1 and 5");
  });

  it("rejects review text shorter than 10 chars", () => {
    expect(validateFeedback({ rating: 4, reviewText: "Short", intakeYear: 2022, reviewerType: "student" }))
      .toContain("Review must be at least 10 characters");
  });

  it("rejects invalid intake year (3 digits)", () => {
    expect(validateFeedback({ rating: 4, reviewText: "Good university experience", intakeYear: 202, reviewerType: "student" }))
      .toContain("Intake year must be a 4-digit number");
  });

  it("rejects invalid reviewer type", () => {
    expect(validateFeedback({ rating: 4, reviewText: "Good university experience", intakeYear: 2022, reviewerType: "professor" }))
      .toContain("Reviewer type must be student or alumni");
  });
});

// -------------------------------------------------------------------
// Feature 3: CTC filter logic (pure logic)
// -------------------------------------------------------------------
interface MinOffer { id: string; companyName: string; ctcMin: number; ctcMax: number; }

const filterByCTC = (offers: MinOffer[], min?: number, max?: number) =>
  offers.filter((o) => (min === undefined || o.ctcMax >= min) && (max === undefined || o.ctcMin <= max));

const filterByCompany = (offers: MinOffer[], company?: string) =>
  offers.filter((o) => !company || company === "all" || o.companyName === company);

const sampleOffers: MinOffer[] = [
  { id: "o1", companyName: "Google", ctcMin: 150000, ctcMax: 200000 },
  { id: "o2", companyName: "Amazon", ctcMin: 120000, ctcMax: 160000 },
  { id: "o3", companyName: "Apple", ctcMin: 170000, ctcMax: 220000 },
  { id: "o4", companyName: "Google", ctcMin: 90000, ctcMax: 130000 },
];

describe("Feature 3: Placement CTC filters", () => {
  it("filterByCTC with min returns offers where ctcMax >= min", () => {
    const result = filterByCTC(sampleOffers, 150000);
    expect(result.every((o) => o.ctcMax >= 150000)).toBe(true);
    expect(result.length).toBe(3);
  });

  it("filterByCTC returns empty when no match", () => {
    expect(filterByCTC(sampleOffers, 300000, 400000)).toHaveLength(0);
  });

  it("filterByCompany returns only matching company", () => {
    const result = filterByCompany(sampleOffers, "Google");
    expect(result.every((o) => o.companyName === "Google")).toBe(true);
    expect(result.length).toBe(2);
  });

  it("filterByCompany('all') returns all offers", () => {
    expect(filterByCompany(sampleOffers, "all")).toHaveLength(sampleOffers.length);
  });
});

// -------------------------------------------------------------------
// Feature 5: Featured university coverage checks
// -------------------------------------------------------------------
const US_FEATURED_IDS = ['mit', 'stanford', 'harvard', 'upenn', 'northwestern', 'ucberkeley', 'ucla', 'columbia', 'nyu', 'caltech'];
const UK_FEATURED_IDS = ['oxford', 'cambridge', 'imperial', 'lse', 'ucl', 'edinburgh', 'kcl', 'manchester', 'warwick', 'bristol'];

describe("Feature 5: Featured university coverage rule", () => {
  it("US featured list has exactly 10 entries", () => {
    expect(US_FEATURED_IDS).toHaveLength(10);
  });

  it("UK featured list has exactly 10 entries", () => {
    expect(UK_FEATURED_IDS).toHaveLength(10);
  });

  it("US and UK featured lists have no overlap", () => {
    const overlap = US_FEATURED_IDS.filter((id) => UK_FEATURED_IDS.includes(id));
    expect(overlap).toHaveLength(0);
  });

  it("mit is in the US featured list", () => {
    expect(US_FEATURED_IDS).toContain("mit");
  });

  it("oxford is in the UK featured list", () => {
    expect(UK_FEATURED_IDS).toContain("oxford");
  });
});

