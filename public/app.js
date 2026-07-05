const form = document.getElementById("predictionForm");
const predictionsContainer = document.getElementById("predictions");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const instructionModal = document.getElementById("instructionModal");

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

  const formData = new FormData();
  formData.append("title", title);
  formData.append("text", text);
  formData.append("type", type);

  if (imageUrl) {
    formData.append("image", imageUrl);
  }

  if (imageFile) {
    formData.append("imageFile", imageFile);
  }

  const response = await fetch("/predictions", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    alert(errorData.message || "Не вдалося додати передбачення");
    return;
  }

  form.reset();
  loadPredictions();
});

predictionsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;

    await fetch(`/predictions/${id}`, {
      method: "DELETE",
    });

    loadPredictions();
  }
});

loadPredictions();
