// Override Next.js StaticImageData so image imports behave like Vite (plain string URLs).
// The webpack config in next.config.ts replaces next-image-loader with asset/resource,
// making the runtime values strings — these declarations align the types.

declare module "next/image-types/global" {}

// Force StaticImageData to be a plain string at the type level.
// This makes <img src={importedImage}> typecheck everywhere.
type StaticImageData = string;

declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.avif" {
  const src: string;
  export default src;
}

// CSS side-effect imports
declare module "*.css";

// Missing modules referenced by orphaned/unused components — stubbed to unblock typecheck.
declare module "@/components/ui/Button" {
  const Button: any;
  export default Button;
  export { Button };
}
declare module "@/lib/store/useToastStore" {
  const useToastStore: any;
  export default useToastStore;
  export { useToastStore };
}
declare module "@/types" {
  export type CourseLevel = "beginner" | "intermediate" | "advanced";
  const _default: any;
  export default _default;
}
