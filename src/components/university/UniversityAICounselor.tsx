import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { University } from "@/data/universities";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UniversityAICounselorProps {
  university: University;
}

const UniversityAICounselor = ({ university }: UniversityAICounselorProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: `Hi! I'm your AI guide for ${university.name}. What would you like to know about admissions, campus life, or programs?`
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          sender: "ai", 
          text: `That's a great question about ${university.name}. Since this is a demo, I recommend booking a free 1-on-1 session with our human counselors for a personalized answer regarding ${input.substring(0, 15)}...` 
        }
      ]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-0 overflow-hidden flex flex-col h-[500px]"
    >
      <div className="p-6 bg-secondary/30 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center relative">
            <Bot className="w-6 h-6 text-accent" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
          </div>
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              Ask Akshaya AI <Sparkles className="w-4 h-4 text-accent" />
            </h3>
            <p className="text-xs text-muted-foreground">Expert on {university.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-accent/20 text-accent"
              }`}>
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${
                msg.sender === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-secondary/50 border border-border/50 rounded-tl-none text-foreground"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-background border-t border-border/50">
        <div className="relative">
          <Input 
            placeholder="Ask anything about fees, visas, or courses..." 
            className="pr-12 bg-secondary/30 border-border/50 focus:border-accent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="absolute right-1 top-1 w-8 h-8 bg-accent hover:bg-accent/90"
            onClick={handleSend}
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityAICounselor;
