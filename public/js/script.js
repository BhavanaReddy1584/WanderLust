// BOOTSTRAP FORM VALIDATION
(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();




// FILTER SLIDER (LEFT / RIGHT) :
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.getElementById("filters");
  const leftBtn = document.querySelector(".scroll-btn.left");
  const rightBtn = document.querySelector(".scroll-btn.right");

  // Safety check (prevents errors on pages without filters)
  if (!filters || !leftBtn || !rightBtn) return;

  leftBtn.addEventListener("click", () => {
    filters.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  });

  rightBtn.addEventListener("click", () => {
    filters.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  });
});
