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
      if (importPath.startsWith(".")) {
        // Ensure `.js` or `.jsx` extension
        if (!importPath.endsWith(".js") && !importPath.endsWith(".jsx")) {
          const fullPathJs = path.resolve(path.dirname(file), importPath + ".js");
          const fullPathJsx = path.resolve(path.dirname(file), importPath + ".jsx");

          if (fs.existsSync(fullPathJs)) {
            importPath += ".js";
          } else if (fs.existsSync(fullPathJsx)) {
            importPath += ".jsx";
          }
        }

        // Prefix with /user
        if (!importPath.includes("/user/")) {
          importPath = importPath.replace(/^\.\//, "./user/");
        }

        changed = true;
        return match.replace(/["'](.*?)["']/, `"${importPath}"`);
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
