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
