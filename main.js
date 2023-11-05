// Obtenemos los elementos del DOM
const reminderForm = document.getElementById("reminder-form");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const reminderList = document.getElementById("reminder-list");
const timeInput = document.getElementById("time");
const botonInput = document.getElementById("boton");

dateInput.addEventListener("click", function () {
  updateDateMin();
});

timeInput.addEventListener("click", function () {
  updateTimeMin();
});

botonInput.addEventListener("click", function () {
  updateDateMin();
  updateTimeMin();
});

// Función para actualizar el mínimo en el campo de fecha
function updateDateMin() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; 
  const day = now.getDate();

  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  dateInput.min = formattedDate;
}

// Función para actualizar el mínimo en el campo de hora
function updateTimeMin() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const selectedDate = new Date(dateInput.value);

  if (selectedDate.toDateString() === now.toDateString()) {
    timeInput.min = "00:00";
  } else {
    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    timeInput.min = formattedTime;
  }
}

// Evento para agregar un recordatorio
reminderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const date = dateInput.value;
  const time = timeInput.value; 
  const description = descriptionInput.value;
  const dateTime = new Date(`${date}T${time}`); 

  // Verificamos si el navegador admite el almacenamiento local
  if (typeof Storage !== "undefined") {
    // Obtenemos la lista de recordatorios almacenados
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

    // Agregamos el nuevo recordatorio
    reminders.push({ dateTime, description }); // Almacenar fecha y hora

    // Ordenar recordatorios por fecha y hora
    reminders.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    // Almacenamos la lista actualizada
    localStorage.setItem("reminders", JSON.stringify(reminders));

    //Notificaciones
    if ("Notification" in window) {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          // Permisos concedidos, puedes mostrar notificaciones.
          const now = new Date();
          const reminderDateTime = new Date(dateTime);

          if (reminderDateTime > now) {
            const timeUntilReminder = reminderDateTime - now;

            setTimeout(() => {
              new Notification("Recordatorio", {
                body: description,
              });

              // Agregar vibración al recibir la notificación
              if ("vibrate" in navigator) {
                navigator.vibrate([200, 100, 200]); // Patrón de vibración
              }
            }, timeUntilReminder);
          }
        }
      });
    }

    // Actualizamos la lista en la página
    displayReminders(reminders);

    // Limpiamos los campos del formulario
    dateInput.value = "";
    timeInput.value = "";
    descriptionInput.value = "";
  } else {
    alert("Lo siento, tu navegador no admite almacenamiento local.");
  }
});

// Función para mostrar los recordatorios en la página
function displayReminders(reminders) {
  reminderList.innerHTML = "";

  const now = new Date();

  reminders.forEach(function (reminder, index) {
    const row = document.createElement("tr");

    const reminderDateTime = new Date(reminder.dateTime);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = reminderDateTime.toLocaleDateString("es-ES", options);

    // Celda para la fecha y hora
    const dateCell = document.createElement("td");
    dateCell.textContent = formattedDate;

    // Celda para la descripción
    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = reminder.description;

    // Celda para las acciones (botón de eliminar)
    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Eliminar";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.addEventListener("click", function () {
      // Lógica para eliminar el recordatorio
      reminders.splice(index, 1);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      displayReminders(reminders);
    });

    actionsCell.appendChild(deleteButton);

    row.appendChild(dateCell);
    row.appendChild(descriptionCell);
    row.appendChild(actionsCell);

    // Aplicar color según el estado del recordatorio
    if (reminderDateTime <= now) {
      row.style.backgroundColor = "#AED581"; // Pasados (verde)
    } else {
      const timeUntilReminder = reminderDateTime - now;
      if (timeUntilReminder <= 300000) {
        // Menos de 5 minutos (amarillo)
        row.style.backgroundColor = "#FFD700";
      }
    }

    reminderList.appendChild(row);
  });
}

// Cargamos los recordatorios al cargar la página
if (localStorage.getItem("reminders")) {
  const reminders = JSON.parse(localStorage.getItem("reminders"));
  displayReminders(reminders);
}

//*********Splash**********/

// Espera a que finalice la animación de desvanecido y luego oculta el splash
setTimeout(function () {
  const splashScreen = document.getElementById("splash-screen");
  const img = splashScreen.querySelector("img");
  if (img) {
    img.classList.add("fade-in");
  }

  img.addEventListener("animationend", function () {
    if (splashScreen) {
      splashScreen.style.display = "none";
    }
  });

  setTimeout(function () {
    if (splashScreen) {
      splashScreen.style.display = "none";
    }
  }, 500); 
}, 1000); 

//*****************/
