import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/mock", (req, res) => {
  const mock = JSON.parse(
    fs.readFileSync(path.join(__dirname, "public/mock-data.json"))
  );
  res.json(mock);
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
