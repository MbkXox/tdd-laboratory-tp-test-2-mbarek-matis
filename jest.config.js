import { createDefaultEsmPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultEsmPreset().transform;

export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^(\.{1,2}/.*)\.js$": "$1",
  },
};