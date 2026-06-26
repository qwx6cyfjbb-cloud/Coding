const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("click", () => {

        document.getElementById("user-input").value = card.dataset.prompt;

        document.getElementById("user-input").focus();

    });

});

const themeBtn = document.getElementById("theme-btn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

});