let form = document.getElementById("form"); // Formular für die Eingabe von Aufgaben
let textInput = document.getElementById("textInput"); 
let textarea = document.getElementById("textarea");
let authorInput = document.getElementById("authorInput"); 
let categoryInput = document.getElementById("categoryInput");
let importantInput = document.getElementById("importantInput");
let urgentInput = document.getElementById("urgentInput");
let startDateInput = document.getElementById("startDateInput");
let endDateInput = document.getElementById("endDateInput");
let progressInput = document.getElementById("progressInput");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let searchInput = document.getElementById("searchInput");
let editIndex = null; // Index des zu bearbeitenden Tasks

// Eventlistener für das Formular hinzufügen und die Formularvalidierung 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

//Hilfe durch youtube und Ai
let formValidation = () => {
  let errors = [];
  if (textInput.value === "") {
    errors.push("Task cannot be blank");
  }
  if (textarea.value.length > 255) {
    errors.push("Description cannot exceed 255 characters");
  }

  if (errors.length > 0) {
    msg.innerHTML = errors.join("<br>");
    console.log("failure", errors);
  } else {
    msg.innerHTML = "";
    if (editIndex !== null) {
      // Wenn ein Task bearbeitet wird, aktualisiere den Eintrag
      updateTask(editIndex);
    } else {
      acceptData(); // Andernfalls füge einen neuen Task hinzu
    }
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();
    editIndex = null; // Zurücksetzen des Editierungsindex

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = [];

let acceptData = () => {
  data.push({
    text: textInput.value,
    description: textarea.value,
    author: authorInput.value,
    category: categoryInput.value,
    important: importantInput.checked,
    urgent: urgentInput.checked,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    progress: progressInput.value,
    priority: calculatePriority(importantInput.checked, urgentInput.checked)
  });

  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

let updateTask = (index) => {
  data[index] = {
    text: textInput.value,
    description: textarea.value,
    author: authorInput.value,
    category: categoryInput.value,
    important: importantInput.checked,
    urgent: urgentInput.checked,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    progress: progressInput.value,
    priority: calculatePriority(importantInput.checked, urgentInput.checked)
  };

  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

let calculatePriority = (important, urgent) => {
  if (important && urgent) return "Sofort erledigen";
  if (important && !urgent) return "Einplanen und Wohlfühlen";
  if (!important && urgent) return "Gib es ab";
  return "Weg damit";
};

let createTasks = () => { // Erstellen der Aufgaben 
  tasks.innerHTML = ""; // Löschen der Aufgaben
  data.forEach((task, index) => { 
    tasks.innerHTML += ` 
      <div id=${index}>
        <span class="fw-bold">${task.text}</span>
        <span class="small text-secondary">${task.startDate} - ${task.endDate}</span>
        <p>${task.description}</p>
        <p>Author: ${task.author}</p>
        <p>Category: ${task.category}</p>
        <p>Priority: ${task.priority}</p>
        <p>Progress: ${task.progress}%</p>
        <div class="options">
          <i onClick="editTask(${index})" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
          <i onClick="deleteTask(${index});createTasks()" class="fas fa-trash-alt"></i>
        </div>
      </div>
    `; 
  });
  resetForm();
};

let deleteTask = (index) => {
  data.splice(index, 1);
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

//Wurde teils von geeks for geeks übernommen
let editTask = (index) => {
  let task = data[index];
  textInput.value = task.text;
  textarea.value = task.description;
  authorInput.value = task.author;
  categoryInput.value = task.category;
  importantInput.checked = task.important;
  urgentInput.checked = task.urgent;
  startDateInput.value = task.startDate;
  endDateInput.value = task.endDate;
  progressInput.value = task.progress;
  editIndex = index; // Setzen des Editierungsindex
};

//Wieder durch hilfe von geeks for geeks
let resetForm = () => {
  textInput.value = "";
  textarea.value = "";
  authorInput.value = "";
  categoryInput.value = "Sport";
  importantInput.checked = false;
  urgentInput.checked = false;
  startDateInput.value = "";
  endDateInput.value = "";
  progressInput.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  createTasks();
})();

//Suchfunktion für die Aufgaben teile vom code wurden aus stack overflow kopiert
searchInput.addEventListener("input", (e) => {
  let searchTerm = e.target.value.toLowerCase();
  let filteredData = data.filter(task => task.text.toLowerCase().includes(searchTerm)); // Filtern der Aufgaben nach dem Suchbegriff
  tasks.innerHTML = "";
  filteredData.forEach((task, index) => {
    tasks.innerHTML += `
      <div id=${index}> // Erstellen der Aufgaben
        <span class="fw-bold">${task.text}</span>
        <span class="small text-secondary">${task.startDate} - ${task.endDate}</span>
        <p>${task.description}</p>
        <p>Author: ${task.author}</p>
        <p>Category: ${task.category}</p>
        <p>Priority: ${task.priority}</p>
        <p>Progress: ${task.progress}%</p>
        <div class="options">
          <i onClick="editTask(${index})" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
          <i onClick="deleteTask(${index});createTasks()" class="fas fa-trash-alt"></i>
        </div>
      </div>
    `;
  });
});
