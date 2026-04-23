// Shadow Next.js's global image types module so its `interface StaticImageData`
// declaration is replaced with our own that's assignable to string.
// This file MUST be picked up before next-env.d.ts's `/// <reference types="next/image-types/global" />`.

declare module "next/image-types/global" {
  global {
    // Override Next.js's StaticImageData to be a plain string.
    // Matches the runtime behavior set up by next.config.ts (asset/resource loader).
    type StaticImageData = string;
  }
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
