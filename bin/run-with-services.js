/* eslint-disable no-unused-vars */

const analysisServiceEntries = require("../reuse/analysisServiceEntires");

(async () => {
  const [_node, _this, ...services] = process.argv;

  const entries = analysisServiceEntries(...services);

  await require("@sap/cds/bin/serve")(entries);
})();
