document
  .getElementById("employeeForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Pobieramy wartości z formularza
    const name = document.getElementById("name").value;
    const lastName = document.getElementById("lastName").value;

    const messageElement = document.getElementById("message");

    // Walidacja formularza
    if (!name || !lastName) {
      messageElement.textContent = "Wszystkie pola muszą być wypełnione.";
      messageElement.style.color = "red";
      return;
    }

    // Wysyłanie danych do backendu
    try {
      const response = await fetch(
        "http://https://pracownicy-raports-projects-47cfe79b.vercel.app/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, lastName }),
        }
      );

      const data = await response.json();
      messageElement.textContent = data.message || "Pracownik został dodany!";
      messageElement.style.color = "green";

      // Czyścimy formularz po wysłaniu
      document.getElementById("employeeForm").reset();
    } catch (error) {
      messageElement.textContent = "Wystąpił błąd przy dodawaniu pracownika.";
      messageElement.style.color = "red";
    }
  });
