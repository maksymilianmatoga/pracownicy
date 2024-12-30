// Załaduj zmienne środowiskowe z pliku .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware do obsługi CORS
app.use(
  cors({
    origin: "https://maksymilianmatoga.github.io", // Zamień "*" na dokładną domenę frontendową
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Zezwalaj na te metody
    allowedHeaders: ["Content-Type", "Authorization"], // Zezwalaj na te nagłówki
  })
);

// Middleware do parsowania JSON
app.use(bodyParser.json());

// Połączenie z MongoDB Atlas
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Połączono z MongoDB Atlas"))
  .catch((err) => console.error("Błąd połączenia z MongoDB:", err));

// Schemat pracowników
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
});

// Model pracowników
const Employee = mongoose.model("Employee", EmployeeSchema, "Pracownicy");

// Endpoint do dodawania pracowników
app.post("/employees", (req, res) => {
  const { name, lastName } = req.body;

  if (!name || !lastName) {
    return res.status(400).send({ message: "Imię i nazwisko są wymagane" });
  }

  const newEmployee = new Employee({ name, lastName });

  newEmployee
    .save()
    .then(() => res.status(201).send({ message: "Pracownik został dodany" }))
    .catch((err) =>
      res
        .status(400)
        .send({ message: "Błąd przy dodawaniu pracownika: " + err })
    );
});

// Endpoint do pobierania listy pracowników
app.get("/employees", (req, res) => {
  Employee.find()
    .then((employees) => res.status(200).json(employees))
    .catch((err) =>
      res
        .status(400)
        .send({ message: "Błąd przy pobieraniu pracowników: " + err })
    );
});

// Obsługa żądań preflight (OPTIONS)
app.options("*", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://maksymilianmatoga.github.io"
  ); // Twoja domena frontendowa
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send(); // Odpowiedź na preflight
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie http://localhost:${port}`);
});
