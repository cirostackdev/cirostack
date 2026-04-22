import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "cloud-consulting";
const service = servicesData[slug];

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.description ?? "",
};

export default function CloudConsultingPage() {
  return <ServiceDetail />;
}
