import type { Config } from "prismic-ts-codegen";

const config: Config = {
  repositoryName: "prismic-on-demand-isr-test",

  output: "./types.generated.ts",

  locales: {
    fetchFromRepository: true,
  },

  models: ["./customtypes/**/index.json", "./slices/**/model.json"],
};

export default config;

