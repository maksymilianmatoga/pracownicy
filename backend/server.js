require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware do obsługi CORS
app.use(
  cors({
    origin: "https://maksymilianmatoga.github.io", // Twoja domena frontendowa
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Jeśli korzystasz z ciasteczek lub sesji
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

// Serwowanie plików statycznych z folderu 'frontend'
app.use(express.static(path.join(__dirname, "../frontend"))); // Używamy ../ w celu przejścia do folderu nadrzędnego, gdzie znajduje się folder 'frontend'

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
    "https://maksymilianmatoga.github.io" // Twoja domena frontendowa
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Zezwalaj na ciasteczka
  res.status(200).send(); // Odpowiedź na preflight
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie http://localhost:${port}`);
});
