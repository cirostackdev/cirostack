// Shim that replaces next/dist/shared/lib/image-external via tsconfig "paths".
// Forces StaticImageData to be a plain string so all <img src={imported}> usages typecheck.
export type StaticImageData = string;
export type StaticRequire = string;
export type StaticImport = string;
