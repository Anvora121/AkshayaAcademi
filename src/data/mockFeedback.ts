export interface UniversityFeedback {
  id: string;
  universityId: string;
  reviewerName: string;
  reviewerType: "student" | "alumni";
  rating: 1 | 2 | 3 | 4 | 5;
  reviewText: string;
  intakeYear: number;
  moderationStatus: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const mockFeedbackData: UniversityFeedback[] = [
  // MIT
  {
    id: "f1",
    universityId: "mit",
    reviewerName: "Arjun Sharma",
    reviewerType: "alumni",
    rating: 5,
    reviewText:
      "MIT exceeded every expectation. The research opportunities are unparalleled, and the network you build here opens doors worldwide. The CS program is truly world-class.",
    intakeYear: 2021,
    moderationStatus: "approved",
    createdAt: "2024-05-10",
  },
  {
    id: "f2",
    universityId: "mit",
    reviewerName: "Priya Nair",
    reviewerType: "student",
    rating: 5,
    reviewText:
      "Incredible professors and an amazing research culture. Campus life is vibrant and the AI lab resources are phenomenal. Highly recommend for anyone in STEM.",
    intakeYear: 2023,
    moderationStatus: "approved",
    createdAt: "2024-08-15",
  },
  {
    id: "f3",
    universityId: "mit",
    reviewerName: "Rahul Menon",
    reviewerType: "alumni",
    rating: 4,
    reviewText:
      "Very competitive environment but immensely rewarding. The cost of living in Cambridge is high but scholarships are available. Career support is excellent.",
    intakeYear: 2020,
    moderationStatus: "approved",
    createdAt: "2024-02-20",
  },

  // Stanford
  {
    id: "f4",
    universityId: "stanford",
    reviewerName: "Sneha Patel",
    reviewerType: "alumni",
    rating: 5,
    reviewText:
      "Being at Stanford in Silicon Valley is a game-changer. The entrepreneurial spirit is everywhere — I started my startup here with co-founders I met in class.",
    intakeYear: 2020,
    moderationStatus: "approved",
    createdAt: "2024-06-12",
  },
  {
    id: "f5",
    universityId: "stanford",
    reviewerName: "Vikram Iyer",
    reviewerType: "student",
    rating: 5,
    reviewText:
      "Stanford's Data Science program offers hands-on industry exposure. The faculty are world-renowned researchers who are also incredibly approachable.",
    intakeYear: 2022,
    moderationStatus: "approved",
    createdAt: "2024-09-01",
  },

  // Harvard
  {
    id: "f6",
    universityId: "harvard",
    reviewerName: "Ananya Krishnan",
    reviewerType: "alumni",
    rating: 5,
    reviewText:
      "The Harvard brand carries incredible weight globally. The MBA program's case study method is intense but the peer learning is exceptional.",
    intakeYear: 2019,
    moderationStatus: "approved",
    createdAt: "2024-03-18",
  },
  {
    id: "f7",
    universityId: "harvard",
    reviewerName: "Ravi Subramanian",
    reviewerType: "student",
    rating: 4,
    reviewText:
      "Academically rigorous and socially diverse. The Law school is phenomenal. Housing can be challenging to find but the university helps a lot.",
    intakeYear: 2023,
    moderationStatus: "approved",
    createdAt: "2024-10-05",
  },

  // Oxford
  {
    id: "f8",
    universityId: "oxford",
    reviewerName: "Deepak Ramesh",
    reviewerType: "alumni",
    rating: 5,
    reviewText:
      "The tutorial system at Oxford is unique in the world. One-on-one discussions with experts in your field every week is something no other university offers.",
    intakeYear: 2020,
    moderationStatus: "approved",
    createdAt: "2024-04-22",
  },
  {
    id: "f9",
    universityId: "oxford",
    reviewerName: "Kavya Reddy",
    reviewerType: "student",
    rating: 5,
    reviewText:
      "Oxford is in a league of its own. The PPE program gave me a broad foundation that employers love. The city itself is beautiful and very safe.",
    intakeYear: 2022,
    moderationStatus: "approved",
    createdAt: "2024-07-14",
  },

  // Cambridge
  {
    id: "f10",
    universityId: "cambridge",
    reviewerName: "Ajay Pillai",
    reviewerType: "alumni",
    rating: 5,
    reviewText:
      "Cambridge's research culture is second to none. Being surrounded by Nobel laureates on a daily basis is surreal. The college system builds lifelong friendships.",
    intakeYear: 2019,
    moderationStatus: "approved",
    createdAt: "2024-01-30",
  },

  // Imperial
  {
    id: "f11",
    universityId: "imperial",
    reviewerName: "Suresh Kumar",
    reviewerType: "alumni",
    rating: 4,
    reviewText:
      "Imperial's Computing program is extremely rigorous. Strong industry links — multiple internship offers came through campus connections alone.",
    intakeYear: 2021,
    moderationStatus: "approved",
    createdAt: "2024-05-28",
  },

  // University of Toronto
  {
    id: "f12",
    universityId: "toronto",
    reviewerName: "Meena Gopalan",
    reviewerType: "alumni",
    rating: 4,
    reviewText:
      "U of T is the best value for money among top global universities. The CS program is world-class and Toronto's tech ecosystem provides amazing internship opportunities.",
    intakeYear: 2020,
    moderationStatus: "approved",
    createdAt: "2024-06-08",
  },
  {
    id: "f13",
    universityId: "toronto",
    reviewerName: "Karthik Venkat",
    reviewerType: "student",
    rating: 5,
    reviewText:
      "The AI and ML research at U of T is world-leading — Geoffrey Hinton taught here! The city is incredibly multicultural and welcoming to Indian students.",
    intakeYear: 2023,
    moderationStatus: "approved",
    createdAt: "2024-09-20",
  },

  // UBC
  {
    id: "f14",
    universityId: "ubc",
    reviewerName: "Sindhu Nambiar",
    reviewerType: "alumni",
    rating: 4,
    reviewText:
      "UBC in Vancouver is stunning. The campus is one of the most beautiful in the world. Great research opportunities and very Indian-student-friendly.",
    intakeYear: 2021,
    moderationStatus: "approved",
    createdAt: "2024-03-05",
  },

  // UC Berkeley
  {
    id: "f15",
    universityId: "ucberkeley",
    reviewerName: "Pooja Shetty",
    reviewerType: "alumni",
    rating: 5,
    reviewText:
      "Berkeley is in the heart of Silicon Valley's ecosystem. The EECS program is world-class, and the campus has an incredible energy and spirit.",
    intakeYear: 2020,
    moderationStatus: "approved",
    createdAt: "2024-07-30",
  },
];

/**
 * Get feedback for a specific university (approved only).
 */
export function getFeedbackForUniversity(universityId: string): UniversityFeedback[] {
  return mockFeedbackData.filter(
    (f) => f.universityId === universityId && f.moderationStatus === "approved"
  );
}

/**
 * Calculate average rating for a university.
 */
export function getAverageRating(universityId: string): number {
  const feedback = getFeedbackForUniversity(universityId);
  if (feedback.length === 0) return 0;
  const sum = feedback.reduce((acc, f) => acc + f.rating, 0);
  return Math.round((sum / feedback.length) * 10) / 10;
}
