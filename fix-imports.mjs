import fs from "fs";
import path from "path";
import { glob } from "glob"; // glob v10+ ESM style import

const __dirname = path.resolve();

async function fixImports() {
  // Get all js and jsx files inside src/
  const files = await glob("src/**/*.{js,jsx}", { absolute: true });

  for (const file of files) {
    let content = fs.readFileSync(file, "utf-8");
    let changed = false;

    const importRegex = /import\s+.*?from\s+["'](.*?)["']/g;
    content = content.replace(importRegex, (match, importPath) => {
      if (
        importPath.startsWith(".") &&
        !importPath.endsWith(".js") &&
        !importPath.endsWith(".jsx")
      ) {
        // Possible file paths
        const fullPathJs = path.resolve(path.dirname(file), importPath + ".js");
        const fullPathJsx = path.resolve(
          path.dirname(file),
          importPath + ".jsx"
        );

        if (fs.existsSync(fullPathJs)) {
          changed = true;
          return match.replace(importPath, importPath + ".js");
        } else if (fs.existsSync(fullPathJsx)) {
          changed = true;
          return match.replace(importPath, importPath + ".jsx");
        }
      }
      return match;
    });

    if (changed) {
      fs.writeFileSync(file, content, "utf-8");
      console.log(`✅ Fixed imports in: ${file}`);
    }
  }
}

fixImports().catch((err) => {
  console.error("❌ Error fixing imports:", err);
});
