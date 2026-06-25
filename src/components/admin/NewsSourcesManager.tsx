import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rss,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Zap,
  Database,
  Eye,
  EyeOff,
  Globe,
  Clock,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useNewsSources,
  useCreateNewsSource,
  useDeleteNewsSource,
  useUpdateNewsSource,
  useSeedNewsSources,
  useTriggerRssFetch,
  type NewsSource,
} from "@/hooks/useNews";
import { format } from "date-fns";

const EMPTY_FORM: Partial<NewsSource> = {
  universityName: "",
  rssUrl: "",
  country: "",
};

const SUGGESTED_SOURCES = [
  { universityName: "Harvard University", rssUrl: "https://news.harvard.edu/feed/", country: "USA" },
  { universityName: "MIT", rssUrl: "https://news.mit.edu/rss/feed", country: "USA" },
  { universityName: "Stanford University", rssUrl: "https://news.stanford.edu/feed/", country: "USA" },
  { universityName: "University of Oxford", rssUrl: "https://www.ox.ac.uk/news/rss.xml", country: "UK" },
  { universityName: "University of Cambridge", rssUrl: "https://www.cam.ac.uk/news/feed", country: "UK" },
  { universityName: "University of Toronto", rssUrl: "https://www.utoronto.ca/news/feed", country: "Canada" },
  { universityName: "NUS Singapore", rssUrl: "https://news.nus.edu.sg/feed/", country: "Singapore" },
  { universityName: "Australian National University", rssUrl: "https://www.anu.edu.au/news/rss.xml", country: "Australia" },
];

export const NewsSourcesManager = () => {
  const { data: sources = [], isLoading } = useNewsSources();
  const createSource = useCreateNewsSource();
  const deleteSource = useDeleteNewsSource();
  const updateSource = useUpdateNewsSource();
  const seedSources = useSeedNewsSources();
  const triggerFetch = useTriggerRssFetch();

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<Partial<NewsSource>>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [triggerMsg, setTriggerMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSource.mutateAsync(form);
      setForm(EMPTY_FORM);
      setShowAddForm(false);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    await deleteSource.mutateAsync(id);
    setDeleteConfirm(null);
  };

  const handleToggleActive = (source: NewsSource) => {
    updateSource.mutate({ id: source._id, data: { active: !source.active } });
  };

  const handleTrigger = async () => {
    setTriggerMsg("Aggregation started — check back in a moment.");
    await triggerFetch.mutateAsync();
    setTimeout(() => setTriggerMsg(""), 5000);
  };

  const handleSeed = async () => {
    const result = await seedSources.mutateAsync();
    setTriggerMsg(result.message || "Sources seeded.");
    setTimeout(() => setTriggerMsg(""), 5000);
  };

  // Stats
  const activeSources = sources.filter((s) => s.active).length;
  const totalFetched = sources.reduce((sum, s) => sum + (s.totalFetched || 0), 0);
  const errored = sources.filter((s) => s.lastError).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rss className="w-6 h-6 text-accent" />
            RSS News Sources
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage university RSS feeds. News is fetched every 6 hours automatically.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seedSources.isPending}
            className="gap-1.5"
          >
            {seedSources.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            Seed Defaults
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTrigger}
            disabled={triggerFetch.isPending}
            className="gap-1.5"
          >
            {triggerFetch.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
            Fetch Now
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddForm((v) => !v)}
            className="gap-1.5 bg-accent hover:bg-accent/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Status message */}
      {triggerMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium"
        >
          <CheckCircle className="w-4 h-4" /> {triggerMsg}
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sources", value: sources.length, icon: Rss, color: "text-blue-500" },
          { label: "Active", value: activeSources, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Articles Fetched", value: totalFetched.toLocaleString(), icon: Newspaper, color: "text-accent" },
          { label: "Source Errors", value: errored, icon: AlertTriangle, color: errored > 0 ? "text-rose-500" : "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="premium-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={cn("w-4 h-4", s.color)} />
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <form
            onSubmit={handleSubmit}
            className="premium-card p-6 space-y-4 border-accent/30"
          >
            <h3 className="font-semibold text-foreground">Add RSS Source</h3>

            {/* Quick-fill from suggested */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Quick-fill from suggested sources</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SOURCES.map((s) => {
                  const already = sources.some((src) => src.rssUrl === s.rssUrl);
                  return (
                    <button
                      type="button"
                      key={s.rssUrl}
                      onClick={() => setForm(s)}
                      disabled={already}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                        already
                          ? "border-border text-muted-foreground/50 cursor-not-allowed"
                          : "border-accent/30 text-accent hover:bg-accent/10"
                      )}
                    >
                      {already ? "✓ " : ""}{s.universityName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="uniName">University Name *</Label>
                <Input
                  id="uniName"
                  value={form.universityName || ""}
                  onChange={(e) => setForm((f) => ({ ...f, universityName: e.target.value }))}
                  placeholder="MIT"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="rssUrl">RSS Feed URL *</Label>
                <Input
                  id="rssUrl"
                  type="url"
                  value={form.rssUrl || ""}
                  onChange={(e) => setForm((f) => ({ ...f, rssUrl: e.target.value }))}
                  placeholder="https://news.mit.edu/rss/feed"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country || ""}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  placeholder="USA"
                />
              </div>
            </div>

            {createSource.error && (
              <p className="text-sm text-rose-500">{String(createSource.error)}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => { setShowAddForm(false); setForm(EMPTY_FORM); }}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={createSource.isPending} className="bg-accent hover:bg-accent/90">
                {createSource.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                Add Source
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Sources table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading sources...
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-16">
          <Rss className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">No RSS sources yet</p>
          <p className="text-sm text-muted-foreground mb-6">Seed the 8 default university sources or add your own.</p>
          <Button type="button" onClick={handleSeed} disabled={seedSources.isPending} className="bg-accent hover:bg-accent/90 gap-2">
            <Database className="w-4 h-4" /> Seed Default Sources
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {sources.map((source) => (
            <motion.div
              key={source._id}
              layout
              className={cn(
                "premium-card p-4 flex items-start gap-4 flex-wrap transition-opacity",
                !source.active && "opacity-60"
              )}
            >
              {/* Status indicator */}
              <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                source.lastError ? "bg-rose-500" :
                source.active ? "bg-emerald-500" : "bg-border"
              )} />

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm">{source.universityName}</span>
                  {source.country && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" /> {source.country}
                    </span>
                  )}
                  {source.isAutoFetched === undefined && source.totalFetched > 0 && (
                    <span className="text-xs text-accent font-medium">{source.totalFetched} articles</span>
                  )}
                  <span className="text-xs text-accent font-medium">{source.totalFetched} articles</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">{source.rssUrl}</p>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  {source.lastFetched && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last fetched {format(new Date(source.lastFetched), "MMM d, HH:mm")}
                    </span>
                  )}
                  {source.lastError && (
                    <span className="text-[11px] text-rose-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Error: {source.lastError.slice(0, 60)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(source)}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    source.active ? "text-emerald-500 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-secondary"
                  )}
                  title={source.active ? "Disable source" : "Enable source"}
                >
                  {source.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {deleteConfirm === source._id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(source._id)}
                      className="px-2 py-1 rounded text-xs bg-rose-500 text-white hover:bg-rose-600 font-semibold"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 rounded text-xs bg-secondary text-foreground hover:bg-secondary/80 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(source._id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cron info */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-secondary/40 border border-border/50 text-xs text-muted-foreground">
        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
        <div>
          <span className="font-semibold text-foreground">Auto-fetch schedule:</span> RSS feeds are polled every 6 hours (cron: <code className="bg-secondary px-1 rounded">0 */6 * * *</code>). Articles are deduplicated by URL and title before saving. AI summaries are generated via Groq (llama3-8b-8192).
        </div>
      </div>
    </div>
  );
};
