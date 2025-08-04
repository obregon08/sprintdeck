import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  "stories": [
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.mdx"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "viteFinal": async (config) => {
    // Add module mocking
    if (config.define) {
      config.define = {
        ...config.define,
        'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify('https://mock.supabase.co'),
        'process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY': JSON.stringify('mock-key'),
      };
    }
    
    return config;
  },
};
export default config;