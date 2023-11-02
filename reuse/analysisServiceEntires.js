/**
 *
 * @param  {Array<string>} services
 */
async function analysisServiceEntries(...services) {
  const { glob } = require("glob");
  const fs = require("fs/promises");

  const parser = require("@sap/cds-compiler/lib/language/antlrParser");

  const cdsFiles = await glob("**/*.cds", { ignore: "node_modules/**" });

  const asts = await Promise.all(
    cdsFiles.map(async (cdsFile) => ({
      ast: parser(await fs.readFile(cdsFile, { encoding: "utf-8" }), cdsFile),
      file: cdsFile,
    })),
  );

  const entries = new Set();

  for (const { ast, file } of asts) {
    const ns = ast.namespace?.path?.map((p) => p.id).join(".");
    const fullArtifactsNames = Object.keys(ast.artifacts).map((name) =>
      ns == undefined ? name : `${ns}.${name}`,
    );
    if (
      fullArtifactsNames.some((fullArtifactsName) =>
        services.includes(fullArtifactsName),
      )
    ) {
      entries.add(file);
    }

    if (
      ast.extensions.some((ext) => {
        const baseNs = ext.name?.path?.[0].id;
        const using = ast.usings.find((using) =>
          using.usings.find(
            (using) =>
              using?.name?.id == baseNs ||
              using?.extern?.path[using.extern.path.length - 1]?.id == baseNs,
          ),
        );
        const extern = using?.usings?.[0].extern;
        const usingPath = extern?.path ?? [];
        const fullPath = [
          ...usingPath,
          ...(usingPath.length > 0 ? ext.name.path.slice(1) : ext.name.path),
        ]
          .map((p) => p.id)
          .join(".");
        return services.includes(fullPath);
      })
    ) {
      entries.add(file);
    }
  }
  return Array.from(entries);
}

module.exports = analysisServiceEntries;
