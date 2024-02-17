import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bodyParser from "body-parser";
import fs from "fs";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = process.env.PORT || 3345;

app.use(express.static(__dirname + "/"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.post("/data", async (req, res) => {
  const { namePet, birthdatePet, gener, imagePet, nameOwner, cellphone } =
    req.body;

  const formData = {
    namePet,
    birthdatePet,
    gener,
    imagePet,
    nameOwner,
    cellphone,
  };
  const jsonData = JSON.stringify(formData);
  const QR = await QRCode.toDataURL("/views/data.html");

  const htmlContent = `
  <div style="display: flex; justify-content: center; align-items: center;">
    <h2>Qr</h2>
    <img src='${QR}'>
  </div>
  `;
  fs.writeFileSync(join(__dirname, "./qr.html"), `${htmlContent}`);

  fs.writeFile(
    join(__dirname, "/data/formData.json"),
    JSON.stringify(formData, null, 2),
    "utf-8",
    (err) => {
      if (err) {
        console.error("Error", err);
        res.status(500).send("Error interno");
        return;
      }
      console.log("Datos guardados");
    }
  );
  res.redirect(`qr.html`);
});

app.listen(port, () => {
  console.log(`Server runnig in the port: http://localhost:${port}`);
});
