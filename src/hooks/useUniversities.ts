import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";

export interface University {
    _id: string;
    id: string;
    name: string;
    country: string;
    countryName: string;
    location: string;
    ranking: number;
    rankingSource?: "QS" | "THE";
    rankingUpdatedAt?: string;
    logo: string;
    image: string;
    featured: boolean;
    type?: string;
    description?: string;
    founded?: string;
    students?: string;
    acceptanceRate?: string;
    tuitionRange?: string;
    requirements?: {
        gpa: string;
        ielts: string;
        toefl: string;
        gre?: string;
        gmat?: string;
        other?: string;
    };
    careerOutcomes?: {
        employmentRate: string;
        avgSalary: string;
        topEmployers: string[];
    };
    courses?: any[];
}

export interface Course {
    _id: string;
    name: string;
    university: Partial<University>;
    degreeLevel: string;
    tuitionFee: number;
    tuitionCurrency: string;
    tuitionOriginal: string;
    duration: string;
    intakeMonths: string[];
}

export const useUniversities = (filters: { country?: string, search?: string, featured?: boolean } = {}) => {
    return useQuery({
        queryKey: ['universities', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.country && filters.country !== 'all') params.append('country', filters.country);
            if (filters.search) params.append('search', filters.search);
            if (filters.featured) params.append('featured', 'true');

            const response = await fetch(`${API_BASE_URL}/universities?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch universities');
            return response.json() as Promise<University[]>;
        }
    });
};

export const useUniversity = (id: string) => {
    return useQuery({
        queryKey: ['university', id],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/universities/${id}`);
            if (!response.ok) throw new Error('Failed to fetch university');
            return response.json() as Promise<University & { courses: Course[] }>;
        },
        enabled: !!id
    });
};

interface PaginatedUniversitiesResponse {
    universities: University[];
    pagination: { total: number; page: number; pages: number; limit: number };
}

export const useInfiniteUniversities = (
    filters: { country?: string; search?: string; featured?: boolean } = {},
    pageSize = 12
) => {
    return useInfiniteQuery<PaginatedUniversitiesResponse>({
        queryKey: ['universities-infinite', filters, pageSize],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams();
            if (filters.country && filters.country !== 'all') params.append('country', filters.country);
            if (filters.search) params.append('search', filters.search);
            if (filters.featured) params.append('featured', 'true');
            params.append('page', String(pageParam));
            params.append('limit', String(pageSize));

            const response = await fetch(`${API_BASE_URL}/universities?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch universities');
            return response.json() as Promise<PaginatedUniversitiesResponse>;
        },
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const usePaginatedUniversities = (
    filters: { country?: string; search?: string; featured?: boolean } = {},
    page = 1,
    pageSize = 12
) => {
    return useQuery<PaginatedUniversitiesResponse>({
        queryKey: ['universities-paginated', filters, page, pageSize],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.country && filters.country !== 'all') params.append('country', filters.country);
            if (filters.search) params.append('search', filters.search);
            if (filters.featured) params.append('featured', 'true');
            params.append('page', String(page));
            params.append('limit', String(pageSize));

            const response = await fetch(`${API_BASE_URL}/universities?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch universities');
            const data = await response.json();
            if (Array.isArray(data)) {
                return {
                    universities: data,
                    pagination: { total: data.length, page: 1, pages: 1, limit: data.length },
                };
            }
            return data as PaginatedUniversitiesResponse;
        },
        placeholderData: keepPreviousData,
    });
};

export const useCourseSearch = (filters: any) => {
    return useQuery({
        queryKey: ['courses', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] && filters[key] !== 'all') {
                    params.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/universities/courses/search?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch courses');
            return response.json();
        }
    });
};
