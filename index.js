import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const assetPath = path.join(__dirname, "public", ".well-known", "assetlinks.json");

app.get("/.well-known/assetlinks.json", (req, res) => {
  console.log("[assetlinks] requested ->", assetPath, "exists:", fs.existsSync(assetPath));
  if (!fs.existsSync(assetPath)) {
    console.error("[assetlinks] NOT FOUND at", assetPath);
    return res.status(404).send("assetlinks.json not found on server");
  }

  res.sendFile("assetlinks.json", { root: path.join(__dirname, "public", ".well-known") }, (err) => {
    if (err) {
      console.error("[assetlinks] sendFile error:", err);
      if (!res.headersSent) res.status(err.status || 500).send("Error sending assetlinks.json");
    }
  });
});

// fallback: serve SPA index
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
