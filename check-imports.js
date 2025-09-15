import fs from "fs";
import path from "path";

// Project source folder (adjust agar src ka naam alag hai)
const SRC_DIR = path.join(process.cwd(), "src");

function getAllFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, files);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      files.push(filePath);
    }
  });
  return files;
}

function checkImports() {
  const files = getAllFiles(SRC_DIR);
  const errors = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const regex = /import\s+.*?from\s+["'](.+)["']/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      let importPath = match[1];

      // Sirf relative imports check karo
      if (importPath.startsWith(".")) {
        const fullImportPath = path.resolve(path.dirname(file), importPath);
        const dir = path.dirname(fullImportPath);
        const baseName = path.basename(fullImportPath);

        if (fs.existsSync(dir)) {
          const filesInDir = fs.readdirSync(dir);

          // Check actual file ya folder case-sensitive match
          const matchFile = filesInDir.find((f) =>
            f.startsWith(baseName.split(".")[0])
          );

          if (matchFile && matchFile !== path.basename(fullImportPath)) {
            errors.push({
              file,
              importPath,
              actual: matchFile,
            });
          }
        }
      }
    }
  });

  if (errors.length === 0) {
    console.log("✅ No case mismatches found in imports!");
  } else {
    console.log("❌ Case mismatches found:");
    errors.forEach((err) => {
      console.log(
        `File: ${err.file}\n  Import: ${err.importPath}\n  Actual: ${err.actual}\n`
      );
    });
  }
}

checkImports();
