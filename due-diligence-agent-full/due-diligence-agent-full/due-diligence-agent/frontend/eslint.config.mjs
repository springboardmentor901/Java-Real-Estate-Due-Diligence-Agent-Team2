import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // eslint-plugin-react-hooks@7 ships "recommended-latest", which
      // includes experimental React Compiler rules (see its README).
      // This project does not enable the React Compiler (next.config.ts),
      // and these two rules flag the standard, cancellation-guarded
      // fetch-in-useEffect pattern used by lib/hooks/useAsync.ts,
      // lib/hooks/usePolling.ts, and the auth/session bootstrap — a
      // well-understood, safe pattern for client-side data fetching.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
