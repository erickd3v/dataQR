import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bodyParser from "body-parser";
import fs from "fs";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jsonDataPath = join(__dirname, "/data/formData.json");

const app = express();

const port = process.env.PORT || 3345;

app.use(express.static(__dirname + "/"));

app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/css"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.post("/data", async (req, res) => {
  const { namePet, birthdatePet, gener, imagePet, nameOwner, cellphone } =
    req.body;

  const newFormData = {
    randomId: Math.random().toString(36).substring(2, 9), // Generamos un randomId único
    namePet,
    birthdatePet,
    gener,
    imagePet,
    nameOwner,
    cellphone,
  };

  let formDataArray = [];

  try {
    const existingData = fs.readFileSync(jsonDataPath, "utf-8");
    formDataArray = JSON.parse(existingData);
  } catch (error) {}

  const isDuplicate = formDataArray.some((formData) => {
    return (
      formData.namePet === newFormData.namePet &&
      formData.nameOwner === newFormData.nameOwner
    );
  });

  if (isDuplicate) {
    res.status(400).send("Error: los datos ya existen en el JSON.");
    return;
  }

  formDataArray.push(newFormData);
  fs.writeFile(
    jsonDataPath,
    JSON.stringify(formDataArray, null, 2),
    "utf-8",
    (err) => {
      if (err) {
        console.error("Error", err);
        res.status(500).send("Error interno");
        return;
      }

      const randomLink = `${req.protocol}://${req.get("host")}/qr/${
        newFormData.randomId
      }`;
      res.redirect(randomLink);
    }
  );
});

app.get("/views/data/:randomId", (req, res) => {
  const randomId = req.params.randomId;

  fs.readFile(jsonDataPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON", err);
      res.status(500).send("Error interno");
      return;
    }
    try {
      const formDataArray = JSON.parse(data);
      const formData = formDataArray.find(
        (formData) => formData.randomId === randomId
      );
      if (!formData) {
        res.status(404).send("Datos no encontrados");
        return;
      }
      // res.sendFile(__dirname + "/views/data.html");
      const formattedData = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Data</title>
            <link rel="stylesheet" href="/style.css" />
          </head>
          <body style="background-color: black">
            <h1 style="color: wheat">Datos del formulario recibidos:</h1>
            <ul id="formData">
              <li>Nombre de la mascota: ${formData.namePet}</li>
              <li>Fecha de nacimiento de la mascota: ${formData.birthdatePet}</li>
              <li>Género de la mascota: ${formData.gener}</li>
              <li>Imagen de la mascota: ${formData.imagePet}</li>
              <li>Nombre del propietario: ${formData.nameOwner}</li>
              <li>Número de teléfono del propietario: ${formData.cellphone}</li>
            </ul>
          </body>
        </html>
      `;
      res.send(formattedData);
    } catch (error) {
      console.error("Error al parsear datos JSON", error);
      res.status(500).send("Error interno");
    }
  });
});

app.get("/qr/:randomId", async (req, res) => {
  const randomId = req.params.randomId;
  const baseUrl = req.protocol + "://" + req.get("host");
  const randomLink = `${baseUrl}/views/data/${randomId}`;

  const QR = await QRCode.toDataURL(randomLink);
  const htmlContent = `
  <div style="display: flex; justify-content: center; align-items: center;">
    <h2>Qr</h2>
    <img src='${QR}'>
  </div>
  `;
  res.send(htmlContent);
});

app.listen(port, () => {
  console.log(`Server runnig in the port: http://localhost:${port}`);
});
