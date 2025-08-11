const express = require("express");
const path = require("path");
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Catch-all without path-to-regexp parsing issues
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Direct route for assetlinks.json
app.get("/.well-known/assetlinks.json", (req, res) => {
  res.sendFile(path.join(__dirname, ".well-known", "assetlinks.json"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});