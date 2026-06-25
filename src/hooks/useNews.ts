import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";

export interface NewsArticle {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    content?: string;
    featuredImage?: string;
    category: string;
    tags: string[];
    universityName?: string;
    country?: string;
    author: string;
    status: "draft" | "published";
    featured: boolean;
    views: number;
    publishDate?: string;
    createdAt: string;
    updatedAt: string;
    // AI & RSS fields
    aiSummary?: string;
    sourceUrl?: string;
    isAutoFetched?: boolean;
}

export interface NewsSource {
    _id: string;
    universityName: string;
    rssUrl: string;
    country: string;
    logoUrl?: string;
    active: boolean;
    lastFetched?: string;
    totalFetched: number;
    lastError?: string;
    createdAt: string;
}

export interface NewsPagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface NewsFilters {
    page?: number;
    limit?: number;
    category?: string;
    country?: string;
    search?: string;
    featured?: boolean;
    universityName?: string;
}

// ── Public Hooks ──────────────────────────────────────────────

export const useNews = (filters: NewsFilters = {}) => {
    return useQuery<{ articles: NewsArticle[]; pagination: NewsPagination }>({
        queryKey: ["news", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append("page", String(filters.page));
            if (filters.limit) params.append("limit", String(filters.limit));
            if (filters.category && filters.category !== "all") params.append("category", filters.category);
            if (filters.country && filters.country !== "all") params.append("country", filters.country);
            if (filters.search) params.append("search", filters.search);
            if (filters.featured) params.append("featured", "true");
            if (filters.universityName) params.append("universityName", filters.universityName);

            const res = await fetch(`${API_BASE_URL}/news?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch news");
            return res.json();
        },
        staleTime: 60_000,
    });
};

export const useNewsArticle = (slug: string) => {
    return useQuery<{ article: NewsArticle; related: NewsArticle[] }>({
        queryKey: ["news-article", slug],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/news/${slug}`);
            if (!res.ok) throw new Error("Article not found");
            return res.json();
        },
        enabled: !!slug,
    });
};

// ── Personalized Recommendation ──────────────────────────────

export const useRecommendedNews = (limit = 6) => {
    return useQuery<NewsArticle[]>({
        queryKey: ["news-recommended", limit],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/news/recommended?limit=${limit}`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch recommendations");
            return res.json();
        },
        staleTime: 5 * 60_000,
    });
};

// ── Admin: RSS Sources ────────────────────────────────────────

export const useNewsSources = () => {
    return useQuery<NewsSource[]>({
        queryKey: ["news-sources"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/news-sources`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch sources");
            return res.json();
        },
    });
};

export const useCreateNewsSource = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<NewsSource>) => {
            const res = await fetch(`${API_BASE_URL}/admin/news-sources`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to create");
            return res.json();
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["news-sources"] }),
    });
};

export const useUpdateNewsSource = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<NewsSource> }) => {
            const res = await fetch(`${API_BASE_URL}/admin/news-sources/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["news-sources"] }),
    });
};

export const useDeleteNewsSource = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/admin/news-sources/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete");
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["news-sources"] }),
    });
};

export const useSeedNewsSources = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/news-sources/seed`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Seed failed");
            return res.json();
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["news-sources"] }),
    });
};

export const useTriggerRssFetch = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/news-sources/trigger`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Trigger failed");
            return res.json();
        },
        onSuccess: () => {
            setTimeout(() => {
                qc.invalidateQueries({ queryKey: ["news-sources"] });
                qc.invalidateQueries({ queryKey: ["news"] });
            }, 3000);
        },
    });
};

// ── Admin Hooks ───────────────────────────────────────────────

export const useAdminNews = () => {
    return useQuery<NewsArticle[]>({
        queryKey: ["admin-news"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/news`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch news");
            return res.json();
        },
    });
};

export const useCreateNews = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<NewsArticle>) => {
            const res = await fetch(`${API_BASE_URL}/admin/news`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to create");
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin-news"] });
            qc.invalidateQueries({ queryKey: ["news"] });
        },
    });
};

export const useUpdateNews = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<NewsArticle> }) => {
            const res = await fetch(`${API_BASE_URL}/admin/news/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to update");
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin-news"] });
            qc.invalidateQueries({ queryKey: ["news"] });
        },
    });
};

export const useDeleteNews = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/admin/news/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete");
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin-news"] });
            qc.invalidateQueries({ queryKey: ["news"] });
        },
    });
};
