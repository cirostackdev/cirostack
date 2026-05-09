"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const ContactConsultation = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Booking request received!", description: "We'll confirm your call within a few hours." });
      router.push("/thank-you");
    }, 1000);
  };

  return (
    <Layout>
      <section className="section-padding pt-32 md:pt-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Book a Free Consultation</h1>
              <p className="text-muted-foreground leading-relaxed mb-10">A 30-minute call with a senior engineer. No sales pitch — just a straight conversation about your idea and whether we're the right fit.</p>
              <h2 className="text-xl font-display font-bold text-foreground mb-6">What to expect</h2>
              <div className="space-y-5 mb-8">
                {[
                  "30 minutes, no prep required",
                  "You talk to an engineer, not a salesperson",
                  "We'll tell you honestly if we're not the right fit",
                  "No obligation to proceed after the call",
                  "Follow-up notes sent within 2 hours",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Ready to build instead?{" "}
                <a href="/start" className="text-primary hover:underline">
                  Submit a project brief →
                </a>
              </p>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <form onSubmit={handleSubmit} className="surface-glass rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                    <Input required placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input required type="email" placeholder="jane@startup.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Company / Startup</label>
                  <Input placeholder="Optional" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Your time zone *</label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select time zone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="cst">Central Time (CT)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="gmt">GMT / London</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                      <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                      <SelectItem value="wat">West Africa Time (WAT)</SelectItem>
                      <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                      <SelectItem value="sgt">Singapore / HKT</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Preferred time of day</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8am–12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm–5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm–8pm)</SelectItem>
                      <SelectItem value="any">Any time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">What do you want to discuss? *</label>
                  <Textarea required placeholder="Briefly describe your idea, challenge, or question. A sentence or two is enough." rows={4} />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Request a Call"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactConsultation;
