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

async function loadReviews() {

    const container =
        document.getElementById(
            "reviewsContainer"
        );

    try {

        const response =
            await fetch("/api/reviews");


        if (!response.ok) {

            throw new Error(
                "No se pudieron obtener las reseñas"
            );

        }


        const data =
            await response.json();


        document.getElementById("rating")
            .textContent =
            data.rating
                ? data.rating.toFixed(1)
                : "—";


        document.getElementById("reviewCount")
            .textContent =
            data.userRatingCount
                ? `${data.userRatingCount} reseñas en Google`
                : "Google Reviews";


        const rating =
            Math.round(data.rating || 0);


        document.getElementById("stars")
            .textContent =
            "★".repeat(rating) +
            "☆".repeat(5 - rating);


        if (!data.reviews || !data.reviews.length) {

            container.innerHTML = `
                <div class="review-loading">
                    <p>
                        Consulta las opiniones de nuestros clientes en Google.
                    </p>
                </div>
            `;

            return;

        }


        container.innerHTML =
            data.reviews
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


                            <a
                                class="review-google"
                                href="${review.googleMapsUri || '#'}"
                                target="_blank"
                                rel="noopener"
                            >
                                Ver en Google →
                            </a>

                        </article>

                    `;

                })
                .join("");


        if (data.reviewsUri) {

            document
                .getElementById(
                    "googleReviewsLink"
                )
                .href =
                data.reviewsUri;

        }

    }

    catch (error) {

        console.error(error);


        container.innerHTML = `

            <div class="review-loading">

                <p>
                    No pudimos cargar las reseñas ahora.
                </p>

                <a
                    class="text-link"
                    href="https://www.google.com/maps/place/Peluqueria+Anita/"
                    target="_blank"
                >
                    Ver reseñas en Google →
                </a>

            </div>

        `;

    }

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