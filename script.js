const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.getElementById("navLinks");


menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("open");

});


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

        });

    });


document.getElementById("year").textContent =
    new Date().getFullYear();



/* =========================
   GOOGLE REVIEWS
========================= */

const staticReviews = [

    {
        authorName: "Andrea Gutierrez",
        rating: 5,
        relativeTime: "Hace 3 meses",
        text: "Soy clienta hace varios años y su atención siempre ha sido amable cercana profesional trabaja con excelentes productos y a precios muy accesibles, la llamo le pido hora y siempre me atiende a la hora maravillosa la recomiendo 100 % en todos los sentidos."
    },

    {
        authorName: "Lucas Molina",
        rating: 5,
        relativeTime: "Hace un año",
        text: "Excelente servicio, me atendió súper bien con un cafecito y mi cabello me quedó súper!!! Recomendado a 1000."
    },

    {
        authorName: "Tatiana Suarez Rojas",
        rating: 5,
        relativeTime: "Hace un año",
        text: "Lejos la mejor, súper profesional, excelente... un 7... aparte de amorosa y gran mujer... 1000 % recomendada...."
    },

    {
        authorName: "Dani Palma Araya",
        rating: 5,
        relativeTime: "Hace 6 años",
        text: "Hoy fui a cortarme el pelo con mi hermana y quedó excelente el corte... Muy atenta y amable y aclara muy bien las dudas que tengas. Excelente servicio (primera vez que me atiendo con ella y lo seguiré haciendo)."
    },

    {
        authorName: "Yuly UH",
        rating: 5,
        relativeTime: "Hace 7 años",
        text: "Excelente lugar, buena atención, acogedor."
    }

];


function loadReviews() {

    const container =
        document.getElementById(
            "reviewsContainer"
        );

    document.getElementById("rating")
        .textContent =
        "5.0";


    document.getElementById("reviewCount")
        .textContent =
        "5 reseñas destacadas";


    const rating =
        5;


    document.getElementById("stars")
        .textContent =
        "★".repeat(rating) +
        "☆".repeat(5 - rating);


    container.innerHTML =
        staticReviews
                .map(review => {

                    const stars =
                        "★".repeat(
                            Math.round(review.rating)
                        ) +
                        "☆".repeat(
                            5 -
                            Math.round(review.rating)
                        );


                    const initial =
                        review.authorName
                            ? review.authorName
                                .charAt(0)
                                .toUpperCase()
                            : "G";


                    return `

                        <article class="review-card">

                            <div>

                                <div class="review-top">

                                    <div class="reviewer">

                                        <div class="reviewer-avatar">
                                            ${initial}
                                        </div>

                                        <div>

                                            <div class="reviewer-name">
                                                ${escapeHtml(
                                                    review.authorName
                                                )}
                                            </div>

                                            <span class="review-date">
                                                ${escapeHtml(
                                                    review.relativeTime
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div class="review-stars">
                                        ${stars}
                                    </div>

                                </div>


                                <p class="review-text">
                                    ${escapeHtml(
                                        review.text
                                    )}
                                </p>

                            </div>


                        </article>

                    `;

                })
                .join("");

}


function escapeHtml(text) {

    if (!text) return "";

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


loadReviews();