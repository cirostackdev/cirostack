// Shadow Next.js's StaticImageData type at its source so image imports become plain strings.
// next/image-types/global re-exports from this path, so overriding it propagates everywhere.
declare module "next/dist/shared/lib/image-external" {
  export type StaticImageData = string;
  export type StaticRequire = string;
  export type StaticImport = string;
}

// Side-effect CSS imports
declare module "*.css";

// Stub modules referenced by orphaned components.
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
