const uploadBtn = document.getElementById("uploadBtn");
const modal = document.getElementById("uploadModal");
const closeBtn = document.querySelector(".close");

uploadBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});