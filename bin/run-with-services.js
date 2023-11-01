/* eslint-disable no-unused-vars */


(async () => {
  const [_node, _this, ...services] = process.argv;

  const cds = require("@sap/cds");
  const fs = require("fs/promises");
  const parser = require("@sap/cds-compiler/lib/language/antlrParser");
  const logger = cds.log("cds");
  const { glob } = require("glob");

  const cdsFiles = await glob('**/*.cds', { ignore: 'node_modules/**' });

  const asts = await Promise.all(cdsFiles.map(async cdsFile => ({
    ast: parser(
      await fs.readFile(cdsFile, { encoding: "utf-8" }),
      cdsFile
    ),
    file: cdsFile
  })));

  const serveFiles = new Set();

  for (const { ast, file } of asts) {
    const ns = ast.namespace?.path?.map(p => p.id).join(".");
    const fullArtifactsNames = Object.keys(ast.artifacts).map(name => ns == undefined ? name : `${ns}.${name}`);
    if (fullArtifactsNames.some(fullArtifactsName => services.includes(fullArtifactsName))) {
      serveFiles.add(file);
    }
    // TODO: the last part of extension.name.path is not precise
    if (ast.extensions.some(ext => services.some(srv => srv.endsWith(ext.name?.path?.[ext.name.path.length - 1]?.id)))) {
      serveFiles.add(file);
    }
  }

  await require("@sap/cds/bin/serve")(Array.from(serveFiles));
})();
