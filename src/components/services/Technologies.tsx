"use client";

import { type ServiceEntry } from "@/data/services/types";
import { motion } from "framer-motion";
import { useState } from "react";

// Each tech maps to an array of logo URLs to try in order
const logoSources: Record<string, string[]> = {
  "React": [
    "https://cdn.simpleicons.org/react",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  ],
  "React Native": [
    "https://cdn.simpleicons.org/react",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  ],
  "Next.js": [
    "https://cdn.simpleicons.org/nextdotjs",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  ],
  "Node.js": [
    "https://cdn.simpleicons.org/nodedotjs",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  ],
  "TypeScript": [
    "https://cdn.simpleicons.org/typescript",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  ],
  "Tailwind CSS": [
    "https://cdn.simpleicons.org/tailwindcss",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  ],
  "Framer Motion": [
    "https://cdn.simpleicons.org/framer",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg",
  ],
  "Vercel": [
    "https://cdn.simpleicons.org/vercel",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  ],
  "Python": [
    "https://cdn.simpleicons.org/python",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  ],
  "TensorFlow": [
    "https://cdn.simpleicons.org/tensorflow",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  ],
  "PyTorch": [
    "https://cdn.simpleicons.org/pytorch",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  ],
  "scikit-learn": [
    "https://cdn.simpleicons.org/scikitlearn",
    "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
  ],
  "MLflow": [
    "https://cdn.simpleicons.org/mlflow",
    "https://www.mlflow.org/img/mlflow-black.svg",
  ],
  "AWS SageMaker": [
    "https://cdn.simpleicons.org/amazonsagemaker",
    "https://cdn.simpleicons.org/amazonwebservices",
  ],
  "AWS": [
    "https://cdn.simpleicons.org/amazonwebservices",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  ],
  "AWS Redshift": [
    "https://cdn.simpleicons.org/amazonredshift",
    "https://cdn.simpleicons.org/amazonwebservices",
  ],
  "AWS Cognito": [
    "https://cdn.simpleicons.org/amazoncognito",
    "https://cdn.simpleicons.org/amazonwebservices",
  ],
  "AWS Config": [
    "https://cdn.simpleicons.org/amazonwebservices",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  ],
  "AWS SecurityHub": [
    "https://cdn.simpleicons.org/amazonwebservices",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  ],
  "GCP": [
    "https://cdn.simpleicons.org/googlecloud",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  ],
  "Terraform": [
    "https://cdn.simpleicons.org/terraform",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
  ],
  "Kubernetes": [
    "https://cdn.simpleicons.org/kubernetes",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg",
  ],
  "Docker": [
    "https://cdn.simpleicons.org/docker",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  ],
  "Prometheus": [
    "https://cdn.simpleicons.org/prometheus",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg",
  ],
  "C": [
    "https://cdn.simpleicons.org/c",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  ],
  "C++": [
    "https://cdn.simpleicons.org/cplusplus",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  ],
  "FreeRTOS": [
    "https://cdn.simpleicons.org/freertos",
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Logo_fridge_FreeRTOS.png",
  ],
  "Zephyr": [
    "https://cdn.simpleicons.org/zephyrproject",
    "https://raw.githubusercontent.com/zephyrproject-rtos/zephyr/main/doc/_static/images/logo-readme.svg",
  ],
  "ESP-IDF": [
    "https://cdn.simpleicons.org/espressif",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/espressif/espressif-original.svg",
  ],
  "Linux": [
    "https://cdn.simpleicons.org/linux",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  ],
  "PostgreSQL": [
    "https://cdn.simpleicons.org/postgresql",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  ],
  "REST APIs": [
    "https://cdn.simpleicons.org/openapiinitiative",
    "https://cdn.simpleicons.org/swagger",
  ],
  "MuleSoft": [
    "https://cdn.simpleicons.org/mulesoft",
    "https://cdn.simpleicons.org/salesforce",
  ],
  "Snowflake": [
    "https://cdn.simpleicons.org/snowflake",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/snowflake.svg",
  ],
  "dbt": [
    "https://cdn.simpleicons.org/dbt",
    "https://seeklogo.com/images/D/dbt-logo-500AB0BAA7-seeklogo.com.png",
  ],
  "Airflow": [
    "https://cdn.simpleicons.org/apacheairflow",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg",
  ],
  "Apache Kafka": [
    "https://cdn.simpleicons.org/apachekafka",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",
  ],
  "Tableau": [
    "https://cdn.simpleicons.org/tableau",
    "https://cdn.worldvectorlogo.com/logos/tableau-software.svg",
  ],
  "Auth0": [
    "https://cdn.simpleicons.org/auth0",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/auth0/auth0-original.svg",
  ],
  "Okta": [
    "https://cdn.simpleicons.org/okta",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/okta/okta-original.svg",
  ],
  "Keycloak": [
    "https://cdn.simpleicons.org/keycloak",
    "https://www.keycloak.org/resources/images/keycloak_icon_512px.svg",
  ],
  "Azure AD": [
    "https://cdn.simpleicons.org/microsoftazure",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  ],
  "OAuth 2.0": [
    "https://cdn.simpleicons.org/openid",
    "https://cdn.simpleicons.org/auth0",
  ],
  "Playwright": [
    "https://cdn.simpleicons.org/playwright",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg",
  ],
  "Cypress": [
    "https://cdn.simpleicons.org/cypress",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cypressio/cypressio-original.svg",
  ],
  "Selenium": [
    "https://cdn.simpleicons.org/selenium",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg",
  ],
  "Jest": [
    "https://cdn.simpleicons.org/jest",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
  ],
  "k6": [
    "https://cdn.simpleicons.org/k6",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/k6/k6-original.svg",
  ],
  "Postman": [
    "https://cdn.simpleicons.org/postman",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  ],
  "GitHub Actions": [
    "https://cdn.simpleicons.org/githubactions",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg",
  ],
  "ArgoCD": [
    "https://cdn.simpleicons.org/argo",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/argocd/argocd-original.svg",
  ],
  "Datadog": [
    "https://cdn.simpleicons.org/datadog",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/datadog/datadog-original.svg",
  ],
  "SonarQube": [
    "https://cdn.simpleicons.org/sonarqube",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sonarqube/sonarqube-original.svg",
  ],
  "Snyk": [
    "https://cdn.simpleicons.org/snyk",
    "https://res.cloudinary.com/snyk/image/upload/v1537345894/press-kit/brand/logo-black.png",
  ],
  "Lighthouse": [
    "https://cdn.simpleicons.org/lighthouse",
    "https://cdn.jsdelivr.net/gh/nicedoc/lighthouse-badges/icons/lighthouse.svg",
  ],
  "CodeClimate": [
    "https://cdn.simpleicons.org/codeclimate",
    "https://codeclimate.com/github/favicon.png",
  ],
  "OWASP ZAP": [
    "https://cdn.simpleicons.org/owasp",
    "https://www.zaproxy.org/img/zap-logo.svg",
  ],
  "Kali Linux": [
    "https://cdn.simpleicons.org/kalilinux",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  ],
  "Metasploit": [
    "https://cdn.simpleicons.org/metasploit",
    "https://www.rapid7.com/includes/img/metasploit-logo.svg",
  ],
  "Nessus": [
    "https://cdn.simpleicons.org/tenable",
    "https://cdn.simpleicons.org/tencentqq",
  ],
  "Burp Suite": [
    "https://cdn.simpleicons.org/portswigger",
    "https://portswigger.net/content/images/logos/portswigger-logo.svg",
  ],
  "Java": [
    "https://cdn.simpleicons.org/openjdk",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  ],
  "Supabase": [
    "https://cdn.simpleicons.org/supabase",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
  ],
  "Firebase": [
    "https://cdn.simpleicons.org/firebase",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg",
  ],
  "Stripe": [
    "https://cdn.simpleicons.org/stripe",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
  ],
  "Figma": [
    "https://cdn.simpleicons.org/figma",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  ],
  // Website Development
  "Sanity": [
    "https://cdn.simpleicons.org/sanity",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sanity/sanity-original.svg",
  ],
  // Backend Development
  "Redis": [
    "https://cdn.simpleicons.org/redis",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  ],
  "Prisma": [
    "https://cdn.simpleicons.org/prisma",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
  ],
  // Mobile Apps
  "Flutter": [
    "https://cdn.simpleicons.org/flutter",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  ],
  // Generative AI
  "OpenAI API": [
    "https://cdn.simpleicons.org/openai",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg",
  ],
  "LangChain": [
    "https://cdn.simpleicons.org/langchain",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/langchain.svg",
  ],
  "Pinecone": [
    "https://cdn.simpleicons.org/pinecone",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/pinecone.svg",
  ],
  "Vercel AI SDK": [
    "https://cdn.simpleicons.org/vercel",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  ],
  "LlamaIndex": [
    "https://cdn.simpleicons.org/llamaindex",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/llamaindex.svg",
  ],
  // UX/UI Design
  "Adobe XD": [
    "https://cdn.simpleicons.org/adobexd",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg",
  ],
  "Framer": [
    "https://cdn.simpleicons.org/framer",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg",
  ],
  "Maze": [
    "https://cdn.simpleicons.org/maze",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maze.svg",
  ],
  "Miro": [
    "https://cdn.simpleicons.org/miro",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/miro.svg",
  ],
  "Webflow": [
    "https://cdn.simpleicons.org/webflow",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webflow/webflow-original.svg",
  ],
  // Cloud Consulting
  "Google Cloud": [
    "https://cdn.simpleicons.org/googlecloud",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  ],
  "Azure": [
    "https://cdn.simpleicons.org/microsoftazure",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  ],
  // Startup Branding
  "Adobe Illustrator": [
    "https://cdn.simpleicons.org/adobeillustrator",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
  ],
  "Adobe Photoshop": [
    "https://cdn.simpleicons.org/adobephotoshop",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
  ],
  "After Effects": [
    "https://cdn.simpleicons.org/adobeaftereffects",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg",
  ],
  "Notion": [
    "https://cdn.simpleicons.org/notion",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/notion.svg",
  ],
  // CTO as a Service
  "GitHub": [
    "https://cdn.simpleicons.org/github",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  ],
  "Linear": [
    "https://cdn.simpleicons.org/linear",
    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linear.svg",
  ],
};

function TechLogo({ tech }: { tech: string }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = logoSources[tech];

  if (!sources || sourceIndex >= sources.length) {
    return (
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
        {tech.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt=""
      className="w-8 h-8 object-contain shrink-0"
      loading="lazy"
      onError={() => setSourceIndex((prev) => prev + 1)}
    />
  );
}

export function Technologies({ service }: { service: ServiceEntry }) {
  if (!service.technologies || service.technologies.length === 0) return null;

  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Tech Stack</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Engineering with modern power
            </h3>
            <p className="text-lg text-muted-foreground">
              We select precise, scalable, enterprise-grade tooling to ensure your application remains blazingly fast and profoundly secure.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {service.technologies.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-secondary/40 rounded-2xl border border-border/50 text-center hover:bg-secondary/60 transition-colors"
              >
                <TechLogo tech={tech} />
                <span className="font-bold text-foreground text-sm">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
