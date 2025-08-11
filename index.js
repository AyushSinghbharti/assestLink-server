import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Serve assetlinks.json
app.get("/.well-known/assetlinks.json", (req, res) => {
  res.type("application/json");
  res.sendFile("assetlinks.json", {
    root: path.join(__dirname, "public", ".well-known"),
  });
});

// Check endpoint to verify accessibility & validity
app.get("/check-assetlink", (req, res) => {
  const assetlinksPath = path.join(__dirname, "public", ".well-known", "assetlinks.json");
  
  try {
    if (!fs.existsSync(assetlinksPath)) {
      return res.status(404).json({
        status: "error",
        message: "assetlinks.json not found",
      });
    }

    const rawData = fs.readFileSync(assetlinksPath, "utf8");
    let parsedData;
    try {
      parsedData = JSON.parse(rawData);
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Invalid JSON format in assetlinks.json",
      });
    }

    res.json({
      status: "ok",
      message: "assetlinks.json is accessible",
      data: parsedData,
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error reading assetlinks.json",
      error: err.message,
    });
  }
});

// Fallback: serve SPA index
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
