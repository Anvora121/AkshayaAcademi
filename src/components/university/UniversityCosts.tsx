import { useState } from "react";
import { motion } from "framer-motion";
import { University } from "@/data/universities";
import { getCostBreakdown } from "@/data/universityDetailsExtension";
import { DollarSign, Home, Coffee, Train, HeartPulse, Receipt, Calculator, IndianRupee } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UniversityCostsProps {
  university: University;
}

const UniversityCosts = ({ university }: UniversityCostsProps) => {
  const costs = getCostBreakdown(university.id);
  const [isINR, setIsINR] = useState(false);

  const conversionRate = 83.5; // Example USD to INR
  const formatCurrency = (amount: number) => {
    if (isINR) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount * conversionRate);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: costs.currency, maximumFractionDigits: 0 }).format(amount);
  };

  const totalCost = costs.tuition + costs.living + costs.insurance + costs.misc;
  const livingTotal = costs.rent + costs.food + costs.transport;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8 lg:p-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Calculator className="w-8 h-8 text-accent" />
            Cost Intelligence
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Estimated yearly financial breakdown for {university.name}.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-secondary/30 p-2.5 rounded-full border border-border/50">
          <Label htmlFor="currency-toggle" className={`cursor-pointer ${!isINR ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>USD</Label>
          <Switch 
            id="currency-toggle" 
            checked={isINR} 
            onCheckedChange={setIsINR} 
          />
          <Label htmlFor="currency-toggle" className={`cursor-pointer flex items-center gap-1 ${isINR ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
            <IndianRupee className="w-3 h-3" /> INR
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Total Cost Highlight */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/30 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-2">Estimated Total / Year</p>
            <p className="text-4xl md:text-5xl font-bold text-foreground mb-4">{formatCurrency(totalCost)}</p>
            
            <div className="w-full bg-secondary rounded-full h-3 mb-2 overflow-hidden flex">
              <div className="bg-primary h-full" style={{ width: `${(costs.tuition / totalCost) * 100}%` }} title="Tuition" />
              <div className="bg-amber-500 h-full" style={{ width: `${(costs.living / totalCost) * 100}%` }} title="Living" />
              <div className="bg-emerald-500 h-full" style={{ width: `${(costs.insurance / totalCost) * 100}%` }} title="Insurance" />
              <div className="bg-purple-500 h-full" style={{ width: `${(costs.misc / totalCost) * 100}%` }} title="Misc" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> Tuition</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Living</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Insurance</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Misc</span>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
            <h4 className="font-bold text-foreground mb-2">Affordability Score</h4>
            <p className="text-sm text-muted-foreground mb-4">Compared to national average for international students.</p>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>High Cost</span>
              <span>Moderate</span>
              <span>Affordable</span>
            </div>
            <div className="w-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-2 rounded-full mt-2 relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-4 h-4 bg-white border-2 border-foreground rounded-full shadow" />
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-background border border-border/50 hover:border-accent/30 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Tuition Fees</p>
                <p className="text-xs text-muted-foreground">Average yearly cost</p>
              </div>
            </div>
            <span className="font-bold text-lg">{formatCurrency(costs.tuition)}</span>
          </div>

          <div className="p-5 rounded-2xl bg-background border border-border/50 hover:border-amber-500/30 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Home className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Housing / Rent</p>
                <p className="text-xs text-muted-foreground">On/Off campus avg</p>
              </div>
            </div>
            <span className="font-bold text-lg">{formatCurrency(costs.rent)}</span>
          </div>

          <div className="p-5 rounded-2xl bg-background border border-border/50 hover:border-rose-500/30 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Food & Groceries</p>
                <p className="text-xs text-muted-foreground">Monthly estimates scaled</p>
              </div>
            </div>
            <span className="font-bold text-lg">{formatCurrency(costs.food)}</span>
          </div>

          <div className="p-5 rounded-2xl bg-background border border-border/50 hover:border-blue-500/30 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Train className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Transportation</p>
                <p className="text-xs text-muted-foreground">Public transit / travel</p>
              </div>
            </div>
            <span className="font-bold text-lg">{formatCurrency(costs.transport)}</span>
          </div>

          <div className="p-5 rounded-2xl bg-background border border-border/50 hover:border-emerald-500/30 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Health Insurance</p>
                <p className="text-xs text-muted-foreground">Mandatory student cover</p>
              </div>
            </div>
            <span className="font-bold text-lg">{formatCurrency(costs.insurance)}</span>
          </div>

          <div className="p-5 rounded-2xl bg-background border border-border/50 hover:border-purple-500/30 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Miscellaneous</p>
                <p className="text-xs text-muted-foreground">Books, supplies, personal</p>
              </div>
            </div>
            <span className="font-bold text-lg">{formatCurrency(costs.misc)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityCosts;
