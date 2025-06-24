// TypeScript type declaration for dompurify
// This file is only needed if your environment does not automatically install types
// and you want to avoid TS2307 errors in production.

declare module 'dompurify' {
  const DOMPurify: {
    sanitize: (dirty: string, config?: any) => string;
  };
  export = DOMPurify;
}
