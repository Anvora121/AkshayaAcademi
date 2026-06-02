export interface ExtendedCourse {
  name: string;
  degreeLevel: string;
  duration: string;
  tuitionFee: string;
  intake: string[];
  department: string;
  stemEligible: boolean;
  ranking: number;
  employmentRate: string;
  salaryOutcomes: string;
  popularityScore: number;
}

export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  eligibility: string;
  deadline: string;
  fundingType: string;
  applicationProcess: string;
  probability: "High" | "Medium" | "Low";
}

export interface CostBreakdown {
  tuition: number;
  living: number;
  rent: number;
  food: number;
  transport: number;
  insurance: number;
  misc: number;
  currency: string;
}

export interface LocationIntelligence {
  city: string;
  weather: {
    summer: string;
    winter: string;
    description: string;
  };
  transportScore: number; // out of 100
  safetyScore: number; // out of 100
  studentFriendliness: number; // out of 100
  indianCommunityPresence: "High" | "Medium" | "Low";
  costOfLiving: "High" | "Moderate" | "Low";
  partTimeOpportunities: "Excellent" | "Good" | "Average";
  description: string;
  nearbyAttractions: string[];
}

export interface WhyChooseFeature {
  title: string;
  description: string;
  icon: string; // Will map to Lucide icon in component
}

export const getExtendedCourses = (universityId: string): ExtendedCourse[] => {
  // Generic list for mock purposes
  return [
    {
      name: "Computer Science",
      degreeLevel: "Undergraduate",
      duration: "4 years",
      tuitionFee: "$55,000",
      intake: ["Fall", "Spring"],
      department: "School of Engineering",
      stemEligible: true,
      ranking: 4,
      employmentRate: "98%",
      salaryOutcomes: "$110,000",
      popularityScore: 98,
    },
    {
      name: "Data Science & Artificial Intelligence",
      degreeLevel: "Masters",
      duration: "2 years",
      tuitionFee: "$60,000",
      intake: ["Fall"],
      department: "School of Computing",
      stemEligible: true,
      ranking: 2,
      employmentRate: "99%",
      salaryOutcomes: "$130,000",
      popularityScore: 99,
    },
    {
      name: "Business Administration (MBA)",
      degreeLevel: "MBA",
      duration: "2 years",
      tuitionFee: "$75,000",
      intake: ["Fall"],
      department: "Business School",
      stemEligible: false,
      ranking: 5,
      employmentRate: "94%",
      salaryOutcomes: "$150,000",
      popularityScore: 95,
    },
    {
      name: "Mechanical Engineering",
      degreeLevel: "Undergraduate",
      duration: "4 years",
      tuitionFee: "$52,000",
      intake: ["Fall", "Spring"],
      department: "School of Engineering",
      stemEligible: true,
      ranking: 12,
      employmentRate: "92%",
      salaryOutcomes: "$85,000",
      popularityScore: 85,
    },
    {
      name: "Biomedical Science",
      degreeLevel: "PhD",
      duration: "4-5 years",
      tuitionFee: "Fully Funded",
      intake: ["Fall"],
      department: "School of Medicine",
      stemEligible: true,
      ranking: 8,
      employmentRate: "96%",
      salaryOutcomes: "$95,000",
      popularityScore: 82,
    }
  ];
};

export const getScholarships = (universityId: string): Scholarship[] => {
  return [
    {
      id: "s1",
      name: "Global Excellence Scholarship",
      amount: "Up to $20,000/year",
      eligibility: "High academic merit (GPA 3.8+)",
      deadline: "December 1st",
      fundingType: "Merit-based",
      applicationProcess: "Automatic consideration upon admission",
      probability: "Low"
    },
    {
      id: "s2",
      name: "International Student Grant",
      amount: "$5,000 - $10,000",
      eligibility: "Demonstrated financial need",
      deadline: "March 15th",
      fundingType: "Need-based",
      applicationProcess: "Separate CSS profile application required",
      probability: "Medium"
    },
    {
      id: "s3",
      name: "STEM Future Leaders Award",
      amount: "$15,000",
      eligibility: "Enrolled in eligible STEM program, diverse background",
      deadline: "January 30th",
      fundingType: "Merit & Diversity",
      applicationProcess: "Submit an essay and 1 extra LOR",
      probability: "Low"
    }
  ];
};

export const getCostBreakdown = (universityId: string): CostBreakdown => {
  // Providing generic high-tier US costs as mock data
  return {
    tuition: 55000,
    living: 18000,
    rent: 10000,
    food: 4000,
    transport: 1500,
    insurance: 2500,
    misc: 2000,
    currency: "USD"
  };
};

export const getLocationIntelligence = (universityId: string): LocationIntelligence => {
  return {
    city: "Global Hub",
    weather: {
      summer: "70°F to 85°F (Warm & Sunny)",
      winter: "25°F to 40°F (Snow possible)",
      description: "Experiences all four distinct seasons."
    },
    transportScore: 85,
    safetyScore: 92,
    studentFriendliness: 95,
    indianCommunityPresence: "High",
    costOfLiving: "High",
    partTimeOpportunities: "Excellent",
    description: "A vibrant city known for its rich history, cultural diversity, and booming tech and finance sectors. Highly walkable with great public transit.",
    nearbyAttractions: ["Downtown Tech Hub", "Historic Museums", "Central Park / Gardens", "Startup Incubator Zone"]
  };
};

export const getWhyChooseFeatures = (): WhyChooseFeature[] => {
  return [
    { title: "Global Recognition", description: "Consistently ranked in the top 1% globally.", icon: "Trophy" },
    { title: "Research Excellence", description: "$1B+ in annual research funding.", icon: "FlaskConical" },
    { title: "Innovation Ecosystem", description: "Surrounded by leading tech and finance firms.", icon: "Lightbulb" },
    { title: "Diversity", description: "Students from over 120 countries.", icon: "Globe" },
    { title: "High Employability", description: "Ranked top 10 for graduate employability.", icon: "Briefcase" }
  ];
};
