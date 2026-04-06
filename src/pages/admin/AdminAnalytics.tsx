import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  GraduationCap,
  Star,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import { universitiesData } from "@/data/universities";
import { mockPlacementOffers, countryCTCBenchmarks } from "@/data/mockPlacements";
import { mockFeedbackData } from "@/data/mockFeedback";

interface KPICardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const KPICard = ({ icon: Icon, title, value, subtitle, color = "text-accent" }: KPICardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors"
  >
    <div className="flex items-start justify-between mb-3">
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <div className={`w-9 h-9 rounded-xl bg-secondary flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <p className={`text-3xl font-bold text-foreground mb-1`}>{value}</p>
    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
  </motion.div>
);

const CHART_COLORS = ["#FF6B2C", "#43A3F4", "#34D399", "#A78BFA", "#F59E0B", "#EC4899"];

const AdminAnalytics = () => {
  const stats = useMemo(() => {
    const totalUniversities = universitiesData.length;
    const featuredCount = universitiesData.filter((u) => u.featured).length;

    const approvedFeedback = mockFeedbackData.filter((f) => f.moderationStatus === "approved");
    const avgRating =
      approvedFeedback.length > 0
        ? approvedFeedback.reduce((sum, f) => sum + f.rating, 0) / approvedFeedback.length
        : 0;

    const fullTimeOffers = mockPlacementOffers.filter((p) => p.offerType === "full-time");

    // Placements by country
    const byCountry: Record<string, number> = {};
    mockPlacementOffers.forEach((p) => {
      byCountry[p.country] = (byCountry[p.country] || 0) + 1;
    });
    const placementsByCountry = Object.entries(byCountry)
      .map(([country, count]) => ({ country: country.toUpperCase(), count }))
      .sort((a, b) => b.count - a.count);

    // CTC by country - use benchmark data
    const ctcByCountry = countryCTCBenchmarks.map((b) => ({
      country: b.countryName.substring(0, 8),
      medianCTC: Math.round(b.medianCTC / 1000),
      avgCTC: Math.round(b.averageCTC / 1000),
      currency: b.currency,
    }));

    // Unique companies
    const companies = new Set(fullTimeOffers.map((p) => p.companyName));

    return {
      totalUniversities,
      featuredCount,
      feedbackCount: approvedFeedback.length,
      avgRating: Math.round(avgRating * 10) / 10,
      placementCount: mockPlacementOffers.length,
      companyCount: companies.size,
      placementsByCountry,
      ctcByCountry,
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Platform Analytics</h2>
        <p className="text-muted-foreground text-sm">
          Real-time insights across universities, placements, and student feedback
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          icon={GraduationCap}
          title="Total Universities"
          value={stats.totalUniversities}
          subtitle="All countries"
        />
        <KPICard
          icon={Sparkles}
          title="Featured"
          value={stats.featuredCount}
          subtitle="For Indian students"
          color="text-amber-500"
        />
        <KPICard
          icon={Star}
          title="Avg Rating"
          value={stats.avgRating}
          subtitle={`From ${stats.feedbackCount} reviews`}
          color="text-amber-400"
        />
        <KPICard
          icon={Users}
          title="Reviews"
          value={stats.feedbackCount}
          subtitle="Approved"
          color="text-teal-500"
        />
        <KPICard
          icon={Briefcase}
          title="Placements"
          value={stats.placementCount}
          subtitle="Total offers"
        />
        <KPICard
          icon={TrendingUp}
          title="Companies"
          value={stats.companyCount}
          subtitle="Recruiting"
          color="text-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Placements by Country */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-bold text-foreground mb-1">Placement Offers by Country</h3>
          <p className="text-xs text-muted-foreground mb-6">Number of recorded placement offers</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.placementsByCountry} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="country" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" name="Offers" radius={[4, 4, 0, 0]}>
                {stats.placementsByCountry.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CTC by Country */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-bold text-foreground mb-1">Median CTC by Country</h3>
          <p className="text-xs text-muted-foreground mb-6">Values in thousands (local currency)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.ctcByCountry} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="country" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
                formatter={(value: number, _name: string, props) => [
                  `${props.payload.currency} ${value}k`,
                  "Median CTC",
                ]}
              />
              <Bar dataKey="medianCTC" name="Median CTC" radius={[4, 4, 0, 0]} fill="#FF6B2C">
                {stats.ctcByCountry.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country Summary Table */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-bold text-foreground mb-4">CTC Benchmarks by Country</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Country</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Currency</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Median CTC</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Average CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {countryCTCBenchmarks.map((b) => (
                <tr key={b.country} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 text-foreground font-medium">{b.countryName}</td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">{b.currency}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-accent">
                    <span className="flex items-center justify-end gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {b.medianCTC.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-foreground">
                    {b.averageCTC.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
