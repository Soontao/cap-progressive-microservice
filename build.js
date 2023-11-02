const { build } = require("@sap/cds-dk/lib/build/index.js");
const cds = require("@sap/cds");
const defs = require("./microservices.json");
const analysisServiceEntries = require("./reuse/analysisServiceEntires");

(async () => {
  cds.env.build.tasks = await Promise.all(
    defs.map(async (def) => ({
      for: "nodejs",
      src: "srv",
      dest: `${def.microservice}-srv`,
      options: {
        model: await analysisServiceEntries(def.services),
      },
      clean: false,
    })),
  );

  await build();
})().catch(console.error);
