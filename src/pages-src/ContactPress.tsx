"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const ContactPress = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Request received!", description: "Our press team will respond within 48 hours." });
      router.push("/thank-you");
    }, 1000);
  };

  return (
    <Layout>
      <section className="pt-24 pb-12 md:pt-0 md:pb-0 md:h-[calc(100dvh-5rem)] md:mt-20 md:flex md:items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Press & Speaking</h1>
              <p className="text-muted-foreground leading-relaxed mb-10">Media inquiries, speaking engagements, and panel discussions.</p>
              <div className="divide-y divide-border mb-8">
                {[
                  { title: "Press & Media", body: "Interviews, quotes, expert commentary on software, AI, and African tech." },
                  { title: "Speaking Engagements", body: "Keynotes and talks on startup software development, AI, and building distributed engineering teams." },
                  { title: "Panel Discussions", body: "Founders, tech leaders, and investors — we're available for curated panels on relevant topics." },
                ].map(({ title, body }, i) => (
                  <div key={title} className="py-5 flex gap-6">
                    <span className="text-xs font-bold text-primary tabular-nums shrink-0 mt-0.5">0{i + 1}</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Direct press contact:{" "}
                <a href="mailto:contact@cirostack.com" className="text-primary hover:underline">
                  contact@cirostack.com
                </a>
              </p>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <form onSubmit={handleSubmit} noValidate className="surface-glass rounded-2xl p-6 md:p-8 space-y-4 md:space-y-5 md:max-h-[calc(100dvh-10rem)] md:overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                    <Input required placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input required type="email" placeholder="jane@outlet.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Organisation / Outlet *</label>
                  <Input required placeholder="e.g. TechCrunch, YC, ALX Africa" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Request type *</label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="press">Press / Media Inquiry</SelectItem>
                      <SelectItem value="speaking">Speaking Engagement</SelectItem>
                      <SelectItem value="panel">Panel Discussion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Event / Deadline date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Details *</label>
                  <Textarea
                    required
                    placeholder="Tell us about the event, publication, or opportunity. Include audience size, format, and any relevant context."
                    rows={5}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Request"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPress;
