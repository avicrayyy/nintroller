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
      // Disable set-state-in-effect rule: Setting state in useEffect for initialization
      // (e.g., desktop initialization, localStorage hydration, modal animations) is a valid
      // and intentional pattern that does not violate the rules of hooks
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
