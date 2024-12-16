// Załaduj zmienne środowiskowe z pliku .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Inicjalizacja aplikacji Express
const app = express();
const port = process.env.PORT || 5000; // Używamy zmiennej środowiskowej dla portu na Heroku

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Ustawiamy URL frontendu z zmiennej środowiskowej
    methods: ["GET", "POST"], // Określamy metody, które będą dozwolone
    allowedHeaders: ["Content-Type"], // Określamy, jakie nagłówki będą dozwolone
  })
);
app.use(bodyParser.json()); // Middleware do parsowania JSON w żądaniach

// Połączenie z MongoDB Atlas
const uri = process.env.MONGO_URI; // Używamy zmiennej środowiskowej z połączeniem do MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Połączono z MongoDB Atlas"))
  .catch((err) => console.error("Błąd połączenia z MongoDB:", err));

// Definicja schematu dla pracowników
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Imię
  lastName: { type: String, required: true }, // Nazwisko
});

// Tworzymy model dla kolekcji "Pracownicy" w bazie "Raport"
const Employee = mongoose.model("Employee", EmployeeSchema, "Pracownicy");

// Endpoint do dodawania pracowników
app.post("/employees", (req, res) => {
  const { name, lastName } = req.body; // Oczekujemy imienia i nazwiska

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

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie http://localhost:${port}`);
});
