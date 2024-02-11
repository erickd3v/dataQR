import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = process.env.PORT || 3345;

app.use(express.static(__dirname + "views"));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.listen(port, () => {
  console.log(`Server runnig in the port: htt://localhost:${port}`);
});
