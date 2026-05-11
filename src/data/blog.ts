import imgFixedPrice from "@/assets/blog-fixed-price.jpg";
import imgAiAutomation from "@/assets/blog-ai-automation.jpg";
import imgReactNextjs from "@/assets/blog-react-nextjs.jpg";
import imgDesignTrends from "@/assets/blog-design-trends.jpg";
import imgMvpLaunch from "@/assets/blog-mvp-launch.jpg";
import imgLangchain from "@/assets/blog-langchain.jpg";
import imgCloudMigration from "@/assets/blog-cloud-migration.jpg";
import imgHealthcareTech from "@/assets/blog-healthcare-tech.jpg";
import imgCicdPipeline from "@/assets/blog-cicd-pipeline.jpg";
import imgFintechSecurity from "@/assets/blog-fintech-security.jpg";
import imgDesignSystem from "@/assets/blog-design-system.jpg";
import imgEcommerceHeadless from "@/assets/blog-ecommerce-headless.jpg";
import imgMlProduction from "@/assets/blog-ml-production.jpg";
import imgOutsourcingGuide from "@/assets/blog-outsourcing-guide.jpg";
import imgDataPipeline from "@/assets/blog-data-pipeline.jpg";
import imgScalingStartup from "@/assets/blog-scaling-startup.jpg";

import postsJson from "../../public/content/blog-posts.json";

const imageMap: Record<string, string> = {
  imgFixedPrice,
  imgAiAutomation,
  imgReactNextjs,
  imgDesignTrends,
  imgMvpLaunch,
  imgLangchain,
  imgCloudMigration,
  imgHealthcareTech,
  imgCicdPipeline,
  imgFintechSecurity,
  imgDesignSystem,
  imgEcommerceHeadless,
  imgMlProduction,
  imgOutsourcingGuide,
  imgDataPipeline,
  imgScalingStartup,
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  dateSort: Date;
  readTime: string;
  readMin: number;
  image: string;
  featured: boolean;
  tags: string[];
};

export const posts: BlogPost[] = postsJson.map((p) => ({
  ...p,
  featured: p.featured ?? false,
  image: imageMap[p.imageKey] ?? "",
  dateSort: new Date(p.dateSort),
}));
