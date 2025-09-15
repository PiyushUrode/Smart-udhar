const fs = require("fs");
const path = require("path");
const glob = require("glob");

// project ke src me sab js/jsx file check karo
const files = glob.sync("src/**/*.{js,jsx}", { absolute: true });

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf-8");
  let updated = content;

  // regex: "./axiosClient" ko "./axiosClient.js" se replace karo
  updated = updated.replace(/from\s+["'](\.\/axiosClient)["']/g, `from "./axiosClient.js"`);

  if (updated !== content) {
    console.log(`✅ Fixed import in: ${file}`);
    fs.writeFileSync(file, updated, "utf-8");
  }
});

console.log("🚀 All imports checked and fixed!");
