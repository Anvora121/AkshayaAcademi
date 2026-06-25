import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useNewsArticle } from "@/hooks/useNews";
import {
  Calendar,
  Eye,
  Tag,
  Globe,
  User,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Newspaper,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  "Admission Updates": "bg-blue-500/10 text-blue-600 border-blue-200",
  "Scholarships": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "University Rankings": "bg-amber-500/10 text-amber-600 border-amber-200",
  "Placements": "bg-purple-500/10 text-purple-600 border-purple-200",
  "Visa & Immigration": "bg-orange-500/10 text-orange-600 border-orange-200",
  "Campus Updates": "bg-teal-500/10 text-teal-600 border-teal-200",
  "General Education": "bg-gray-500/10 text-gray-600 border-gray-200",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=1200&q=80";

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useNewsArticle(slug || "");
  const [copied, setCopied] = useState(false);

  const article = data?.article;
  const related = data?.related || [];

  usePageMeta({
    title: article?.title || "News Article",
    description: article?.summary || "",
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-32">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            Loading article...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <Newspaper className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">This article may have been removed or the URL is incorrect.</p>
            <Link to="/news">
              <Button>Browse All News</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const dateStr = article.publishDate || article.createdAt;
  const formattedDate = dateStr ? format(new Date(dateStr), "MMMM d, yyyy") : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative pt-20">
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={article.featuredImage || FALLBACK_IMAGE}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        </div>

        {/* Article */}
        <div className="container mx-auto px-4 max-w-4xl -mt-12 relative z-10 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/news" className="hover:text-accent transition-colors">News</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
            </nav>

            {/* Category + Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold border",
                CATEGORY_COLORS[article.category] || "bg-secondary text-foreground border-border"
              )}>
                {article.category}
              </span>
              {article.tags?.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium border-l-4 border-accent pl-4">
              {article.summary}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {article.author}
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {formattedDate}
                </span>
              )}
              {article.country && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> {article.country}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> {article.views.toLocaleString()} views
              </span>

              {/* Share */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-accent hover:text-accent transition-all text-xs font-medium"
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy Link</>
                )}
              </button>
            </div>

            {/* AI Summary callout */}
            {article.aiSummary && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20 mb-8">
                <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">AI Summary</p>
                  <p className="text-sm text-foreground/90 leading-relaxed">{article.aiSummary}</p>
                </div>
              </div>
            )}

            {/* Source link for auto-fetched articles */}
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors mb-6"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Read original article
              </a>
            )}

            {/* Content */}
            <div
              className="prose prose-base max-w-none text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-foreground/90 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2 [&_li]:text-foreground/90 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_strong]:font-bold [&_strong]:text-foreground [&_a]:text-accent [&_a]:underline [&_hr]:border-border [&_hr]:my-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* University attribution */}
            {article.universityName && (
              <div className="mt-10 p-5 rounded-xl bg-secondary/40 border border-border/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Source University</p>
                  <p className="font-semibold text-foreground">{article.universityName}</p>
                </div>
              </div>
            )}

            {/* Back + View All */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-border/50">
              <Link to="/news">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to News
                </Button>
              </Link>
              <Link to="/news">
                <Button variant="link" className="text-accent">
                  View all articles <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="py-12 bg-secondary/20 border-t border-border/50">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((rel) => {
                  const relDate = rel.publishDate || rel.createdAt;
                  return (
                    <Link key={rel._id} to={`/news/${rel.slug}`} className="group block">
                      <div className="premium-card overflow-hidden">
                        <div className="h-36 overflow-hidden">
                          <img
                            src={rel.featuredImage || FALLBACK_IMAGE}
                            alt={rel.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full border",
                            CATEGORY_COLORS[rel.category] || "bg-secondary text-foreground border-border"
                          )}>
                            {rel.category}
                          </span>
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors mt-2 line-clamp-2 leading-snug">
                            {rel.title}
                          </h3>
                          {relDate && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(relDate), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;
