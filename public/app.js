const form = document.getElementById("predictionForm");
const predictionsContainer = document.getElementById("predictions");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const instructionModal = document.getElementById("instructionModal");
const formTitle = document.getElementById("formTitle");
const predictionIdInput = document.getElementById("predictionId");
const existingImageInput = document.getElementById("existingImage");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
let editingPredictionId = "";

openModalBtn.addEventListener("click", () => {
  instructionModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  instructionModal.classList.add("hidden");
});

instructionModal.addEventListener("click", (e) => {
  if (e.target === instructionModal) {
    instructionModal.classList.add("hidden");
  }
});

async function loadPredictions() {
  const response = await fetch("/predictions");
  const data = await response.json();

  predictionsContainer.innerHTML = "";

  data.forEach((item) => {
    const id = item._id || item.id;
    const card = document.createElement("div");
    card.className = "prediction-card";
    const imageMarkup = item.image
      ? `<img src="${item.image}" alt="${item.title}" />`
      : `<div class="placeholder">Немає зображення</div>`;

    card.innerHTML = `
      ${imageMarkup}
      <div class="prediction-content">
        <h3>${item.title}</h3>
        <p class="prediction-type">Тип: ${item.type || "—"}</p>
        <p>${item.text}</p>
        <button class="edit-btn" data-id="${id}">Редагувати</button>
        <button class="delete-btn" data-id="${id}">Видалити</button>
      </div>
    `;

    predictionsContainer.appendChild(card);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const text = document.getElementById("text").value.trim();
  const type = document.getElementById("type").value;
  const imageUrl = document.getElementById("image").value.trim();
  const imageFile = document.getElementById("imageFile").files[0];
  const predictionId = predictionIdInput.value;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("text", text);
  formData.append("type", type);

  if (imageFile) {
    formData.append("imageFile", imageFile);
  } else if (imageUrl) {
    formData.append("image", imageUrl);
  } else if (predictionId && existingImageInput.value) {
    formData.append("image", existingImageInput.value);
  }

  const method = predictionId ? "PUT" : "POST";
  const url = predictionId ? `/predictions/${predictionId}` : "/predictions";

  const response = await fetch(url, {
    method,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    alert(errorData.message || "Не вдалося зберегти передбачення");
    return;
  }

  resetForm();
  loadPredictions();
});

predictionsContainer.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    await fetch(`/predictions/${id}`, {
      method: "DELETE",
    });

    loadPredictions();
    return;
  }

  if (e.target.classList.contains("edit-btn")) {
    const response = await fetch(`/predictions/${id}`);
    if (!response.ok) {
      alert("Не вдалося отримати передбачення для редагування");
      return;
    }

    const prediction = await response.json();
    startEdit(prediction);
  }
});

cancelEditBtn.addEventListener("click", resetForm);

function startEdit(prediction) {
  editingPredictionId = prediction._id || prediction.id;
  predictionIdInput.value = editingPredictionId;
  existingImageInput.value = prediction.image || "";
  document.getElementById("title").value = prediction.title || "";
  document.getElementById("text").value = prediction.text || "";
  document.getElementById("type").value = prediction.type || "";
  document.getElementById("image").value = "";
  document.getElementById("imageFile").value = "";

  formTitle.textContent = "Редагувати передбачення";
  submitBtn.textContent = "Зберегти";
  cancelEditBtn.classList.remove("hidden");
}

function resetForm() {
  editingPredictionId = "";
  predictionIdInput.value = "";
  existingImageInput.value = "";
  form.reset();
  formTitle.textContent = "Додати передбачення";
  submitBtn.textContent = "Додати";
  cancelEditBtn.classList.add("hidden");
}

loadPredictions();
