import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Star,
  StarOff,
  X,
  Newspaper,
  Calendar,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  useAdminNews,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
  type NewsArticle,
} from "@/hooks/useNews";

const CATEGORIES = [
  "Admission Updates",
  "Scholarships",
  "University Rankings",
  "Placements",
  "Visa & Immigration",
  "Campus Updates",
  "General Education",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "Admission Updates": "bg-blue-500/10 text-blue-600",
  "Scholarships": "bg-emerald-500/10 text-emerald-600",
  "University Rankings": "bg-amber-500/10 text-amber-600",
  "Placements": "bg-purple-500/10 text-purple-600",
  "Visa & Immigration": "bg-orange-500/10 text-orange-600",
  "Campus Updates": "bg-teal-500/10 text-teal-600",
  "General Education": "bg-gray-500/10 text-gray-600",
};

const EMPTY_FORM: Partial<NewsArticle> = {
  title: "",
  summary: "",
  content: "",
  featuredImage: "",
  category: "General Education",
  tags: [],
  universityName: "",
  country: "",
  author: "Akshaya Akademics",
  status: "draft",
  featured: false,
};

export const NewsManager = () => {
  const { data: articles = [], isLoading } = useAdminNews();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<NewsArticle>>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filteredArticles = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setTagsInput("");
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (article: NewsArticle) => {
    setForm({ ...article });
    setTagsInput(article.tags?.join(", ") || "");
    setEditingId(article._id);
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
  };

  const handleFormChange = (field: keyof NewsArticle, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.summary || !form.content || !form.category) {
      setError("Title, summary, content, and category are required.");
      return;
    }
    setError("");
    const payload = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publishDate: form.status === "published" ? new Date().toISOString() : form.publishDate,
    };
    try {
      if (editingId) {
        await updateNews.mutateAsync({ id: editingId, data: payload });
      } else {
        await createNews.mutateAsync(payload);
      }
      closeForm();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNews.mutateAsync(id);
    setDeleteTarget(null);
  };

  const toggleStatus = async (article: NewsArticle) => {
    await updateNews.mutateAsync({
      id: article._id,
      data: {
        status: article.status === "published" ? "draft" : "published",
        publishDate: article.status === "draft" ? new Date().toISOString() : article.publishDate,
      },
    });
  };

  const toggleFeatured = async (article: NewsArticle) => {
    await updateNews.mutateAsync({ id: article._id, data: { featured: !article.featured } });
  };

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
    featured: articles.filter((a) => a.featured).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Articles", value: stats.total, color: "text-foreground" },
          { label: "Published", value: stats.published, color: "text-emerald-600" },
          { label: "Drafts", value: stats.draft, color: "text-amber-600" },
          { label: "Featured", value: stats.featured, color: "text-accent" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-secondary/10 rounded-xl p-4 border border-border/50">
            <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {(["all", "published", "draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-3 py-1 rounded text-xs font-semibold capitalize transition-all",
                  filterStatus === s ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={openCreate} className="bg-blue-500 hover:bg-blue-600 text-white h-9">
          <Plus className="w-4 h-4 mr-1" />
          New Article
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin mr-3" />
          Loading articles...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <Newspaper className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No articles found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {search ? "Try a different search" : "Click 'New Article' to get started"}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-secondary/5 rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden lg:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden lg:table-cell">Views</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {article.featured && <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <span className="font-medium text-foreground line-clamp-1 max-w-xs">{article.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{article.summary}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", CATEGORY_COLORS[article.category] || "bg-secondary text-muted-foreground")}>
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{article.author}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(article)}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors",
                          article.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                        )}
                      >
                        {article.status === "published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {article.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{article.views.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title={article.featured ? "Unfeature" : "Feature"}
                          onClick={() => toggleFeatured(article)}
                          className="w-7 h-7 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          {article.featured
                            ? <StarOff className="w-3.5 h-3.5 text-amber-500" />
                            : <Star className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => openEdit(article)}
                          className="w-7 h-7 rounded flex items-center justify-center hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setDeleteTarget(article._id)}
                          className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl my-8 border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-lg font-bold text-foreground">
                  {editingId ? "Edit Article" : "Create New Article"}
                </h2>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={closeForm}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
                  <Input
                    value={form.title || ""}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="e.g. Harvard Announces New AI Scholarship"
                    required
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Summary *</label>
                  <textarea
                    value={form.summary || ""}
                    onChange={(e) => handleFormChange("summary", e.target.value)}
                    placeholder="Brief summary shown in listings (1-2 sentences)"
                    rows={2}
                    required
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Content *</label>
                  <RichTextEditor
                    value={form.content || ""}
                    onChange={(html) => handleFormChange("content", html)}
                    placeholder="Write your full article here..."
                    className="min-h-[280px]"
                  />
                </div>

                {/* Row: Category + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Category *</label>
                    <select
                      value={form.category || "General Education"}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                    <select
                      value={form.status || "draft"}
                      onChange={(e) => handleFormChange("status", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Row: University + Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      <Globe className="w-3.5 h-3.5 inline mr-1" />
                      University Name
                    </label>
                    <Input
                      value={form.universityName || ""}
                      onChange={(e) => handleFormChange("universityName", e.target.value)}
                      placeholder="e.g. Harvard University"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
                    <Input
                      value={form.country || ""}
                      onChange={(e) => handleFormChange("country", e.target.value)}
                      placeholder="e.g. USA"
                    />
                  </div>
                </div>

                {/* Row: Author + Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Author</label>
                    <Input
                      value={form.author || "Akshaya Akademics"}
                      onChange={(e) => handleFormChange("author", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Tags <span className="text-muted-foreground text-xs">(comma-separated)</span>
                    </label>
                    <Input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Rankings, QS, 2025"
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Featured Image URL</label>
                  <Input
                    value={form.featuredImage || ""}
                    onChange={(e) => handleFormChange("featuredImage", e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                  {form.featuredImage && (
                    <img
                      src={form.featuredImage}
                      alt="Preview"
                      className="mt-2 h-24 w-full object-cover rounded-lg border border-border/50"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleFormChange("featured", !form.featured)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative",
                      form.featured ? "bg-accent" : "bg-border"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                      form.featured ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </button>
                  <span className="text-sm font-medium text-foreground">
                    {form.featured ? "Featured article" : "Not featured"}
                  </span>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
                  <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                  <Button
                    type="submit"
                    disabled={createNews.isPending || updateNews.isPending}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {createNews.isPending || updateNews.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Saving...
                      </span>
                    ) : editingId ? "Save Changes" : "Publish Article"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-background rounded-2xl p-6 w-full max-w-sm border border-border/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-foreground mb-2">Delete Article?</h3>
              <p className="text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <Button
                  type="button"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={deleteNews.isPending}
                  onClick={() => handleDelete(deleteTarget)}
                >
                  {deleteNews.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
