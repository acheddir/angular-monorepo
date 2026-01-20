import { sameTag, SheriffConfig } from "@softarc/sheriff-core";

export const config: SheriffConfig = {
  entryFile: "apps/demo/src/main.ts",
  barrelFileName: "public-api.ts",
  modules: {
    apps: {
      "<app>": {
        src: ["type:app"],
      },
    },
    libs: {
      "<app>-bff": {
        "<domain>": {
          api: {
            src: ["domain:<domain>", "type:api"],
          },
        },
        shared: {
          schema: {
            src: ["domain:shared", "type:schema"],
          },
          "util-<name>": {
            src: ["domain:shared", "type:util"],
          },
        },
      },
      "<app>-contracts": {
        shared: {
          src: ["domain:shared", "type:contract"],
        },
        "<domain>": {
          src: ["domain:<domain>", "type:contract"],
        },
      },
      "<app>": {
        shell: {
          "feature-shell": {
            src: ["type:shell"],
          },
        },
        shared: {
          types: {
            src: ["domain:shared", "type:types"],
          },
          "ui-<name>": {
            src: ["domain:shared", "type:ui"],
          },
          "util-<name>": {
            src: ["domain:shared", "type:util"],
          },
        },
        "<domain>": {
          "feature-<name>": {
            src: ["domain:<domain>", "type:feature"],
          },
          data: {
            src: ["domain:<domain>", "type:data"],
          },
          types: {
            src: ["domain:<domain>", "type:types"],
          },
          "ui-<name>": {
            src: ["domain:<domain>", "type:ui"],
          },
          "util-<name>": {
            src: ["domain:<domain>", "type:util"],
          },
        },
      },
    },
  },
  depRules: {
    root: ["*"],
    // --- domains
    "domain:*": [sameTag, "domain:shared"],
    "domain:shared": [sameTag],
    // --- types
    "type:app": ["*"],
    "type:shell": ["type:feature", "type:util"],
    "type:feature": [sameTag, "type:data", "type:ui", "type:util", "type:types", "type:contract"],
    "type:data": [sameTag, "type:ui", "type:util", "type:types", "type:contract"],
    "type:ui": [sameTag, "type:util", "type:types", "type:contract"],
    "type:api": [sameTag, "type:util", "type:contract", "type:schema"],
    "type:schema": ["type:types", "type:contract"],
    "type:util": [sameTag, "type:contract"],
    "type:types": [sameTag, "type:contract"],
    "type:contract": [sameTag],
  },
};
