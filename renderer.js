const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let calendar, monthYear, noteModal, modalBackdrop, noteText, saveNoteBtn, cancelNoteBtn, modalTitle;
let currentNoteKey = null;

let displayedYear, displayedMonth; // track current displayed month/year

document.addEventListener("DOMContentLoaded", () => {
  calendar = document.getElementById("calendar");
  monthYear = document.getElementById("monthYear");
  noteModal = document.getElementById("noteModal");
  modalBackdrop = document.getElementById("modalBackdrop");
  noteText = document.getElementById("noteText");
  saveNoteBtn = document.getElementById("saveNoteBtn");
  cancelNoteBtn = document.getElementById("cancelNoteBtn");
  modalTitle = document.getElementById("modalTitle");

  // Buttons for month navigation
  document.getElementById("prevMonth").addEventListener("click", () => {
    changeMonth(-1);
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    changeMonth(1);
  });

  saveNoteBtn.addEventListener("click", () => {
    if (currentNoteKey) {
      const note = noteText.value.trim();
      if (note === "") {
        localStorage.removeItem(currentNoteKey);
      } else {
        localStorage.setItem(currentNoteKey, note);
      }
      hideModal();
      renderCalendar();
    }
  });

  cancelNoteBtn.addEventListener("click", () => {
    hideModal();
  });

  modalBackdrop.addEventListener("click", () => {
    hideModal();
  });

  // Initialize with current month/year
  const now = new Date();
  displayedYear = now.getFullYear();
  displayedMonth = now.getMonth();

  renderCalendar();
});

function changeMonth(offset) {
  displayedMonth += offset;

  if (displayedMonth < 0) {
    displayedMonth = 11;
    displayedYear--;
  } else if (displayedMonth > 11) {
    displayedMonth = 0;
    displayedYear++;
  }
  renderCalendar();
}

function renderCalendar() {
  calendar.innerHTML = "";

  monthYear.textContent = `${monthNames[displayedMonth]} ${displayedYear}`;

  const firstDay = new Date(displayedYear, displayedMonth, 1).getDay();
  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = day;

    const now = new Date();
  if (
    day === now.getDate() &&
    displayedMonth === now.getMonth() &&
    displayedYear === now.getFullYear()
  ) {
    div.classList.add("today");
  }

    const key = `${displayedYear}-${displayedMonth}-${day}`;

    if (localStorage.getItem(key)) {
      const noteIcon = document.createElement("span");
      noteIcon.textContent = "📝";
      noteIcon.style.float = "right";
      div.appendChild(noteIcon);
    }

    div.addEventListener("click", () => {
      currentNoteKey = key;
      modalTitle.textContent = `Note for ${day} ${monthNames[displayedMonth]}`;
      noteText.value = localStorage.getItem(key) || "";
      showModal();
    });

    calendar.appendChild(div);
  }
}

function showModal() {
  noteModal.style.display = "block";
  modalBackdrop.style.display = "block";
  noteText.focus();
}

function hideModal() {
  noteModal.style.display = "none";
  modalBackdrop.style.display = "none";
  currentNoteKey = null;
}
