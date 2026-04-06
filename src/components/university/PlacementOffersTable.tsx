import { useState, useMemo } from "react";
import { Building2, Briefcase, MapPin, TrendingUp, DollarSign, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  PlacementOffer,
  CountryCTCBenchmark,
  filterPlacements,
  getUniqueCompanies,
} from "@/data/mockPlacements";

interface PlacementOffersTableProps {
  universityId: string;
  offers: PlacementOffer[];
  medianCTC: number;
  averageCTC: number;
  currency: string;
  benchmark?: CountryCTCBenchmark;
}

const formatCTC = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

const OfferTypeBadge = ({ type }: { type: "intern" | "full-time" }) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
      type === "full-time"
        ? "bg-success/10 text-success border border-success/20"
        : "bg-primary/10 text-primary border border-primary/20"
    )}
  >
    {type === "full-time" ? "Full-Time" : "Intern"}
  </span>
);

const PlacementOffersTable = ({
  universityId,
  offers,
  medianCTC,
  averageCTC,
  currency,
  benchmark,
}: PlacementOffersTableProps) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const companies = useMemo(() => getUniqueCompanies(universityId), [universityId]);

  const filtered = useMemo(() => {
    let result = filterPlacements(
      offers,
      selectedCompany === "all" ? undefined : selectedCompany
    );
    if (selectedType !== "all") {
      result = result.filter((o) => o.offerType === selectedType);
    }
    return result.sort((a, b) => {
      const aAvg = (a.ctcMin + a.ctcMax) / 2;
      const bAvg = (b.ctcMin + b.ctcMax) / 2;
      return sortOrder === "desc" ? bAvg - aAvg : aAvg - bAvg;
    });
  }, [offers, selectedCompany, selectedType, sortOrder]);

  if (offers.length === 0) {
    return (
      <div className="py-10 text-center">
        <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">No placement offers data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CTC Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-accent/10 border border-accent/20"
        >
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            Median CTC (This University)
          </p>
          <p className="text-2xl font-bold text-foreground">
            {medianCTC > 0 ? formatCTC(medianCTC, currency) : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Full-time offers only</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl bg-teal/10 border border-teal/20"
        >
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            Average CTC (This University)
          </p>
          <p className="text-2xl font-bold text-foreground">
            {averageCTC > 0 ? formatCTC(averageCTC, currency) : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Full-time offers only</p>
        </motion.div>

        {benchmark && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-secondary/50 border border-border"
          >
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
              Country Median CTC ({benchmark.countryName})
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatCTC(benchmark.medianCTC, benchmark.currency)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp
                className={cn(
                  "w-3.5 h-3.5",
                  medianCTC > benchmark.medianCTC ? "text-success" : "text-destructive"
                )}
              />
              <p className="text-xs text-muted-foreground">
                {medianCTC > benchmark.medianCTC
                  ? `${Math.round(((medianCTC - benchmark.medianCTC) / benchmark.medianCTC) * 100)}% above country avg`
                  : `${Math.round(((benchmark.medianCTC - medianCTC) / benchmark.medianCTC) * 100)}% below country avg`}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-44 h-9 text-sm">
            <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-Time</SelectItem>
            <SelectItem value="intern">Internship</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder((v) => (v === "desc" ? "asc" : "desc"))}
          className="h-9 gap-2"
        >
          <ArrowUpDown className="w-4 h-4" />
          CTC {sortOrder === "desc" ? "↓ High to Low" : "↑ Low to High"}
        </Button>

        <p className="text-sm text-muted-foreground ml-auto">
          {filtered.length} offer{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">No offers match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">CTC Range</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((offer, i) => (
                <motion.tr
                  key={offer.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                        {offer.companyName[0]}
                      </div>
                      <span className="font-medium text-foreground">{offer.companyName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{offer.role}</td>
                  <td className="px-4 py-3">
                    <OfferTypeBadge type={offer.offerType} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-foreground font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-accent shrink-0" />
                      {formatCTC(offer.ctcMin, offer.currency)} –{" "}
                      {formatCTC(offer.ctcMax, offer.currency)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {offer.location}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{offer.batchYear}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlacementOffersTable;
