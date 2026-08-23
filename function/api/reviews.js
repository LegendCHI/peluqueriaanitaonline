export async function onRequestGet(context) {

    const API_KEY =
        context.env.GOOGLE_PLACES_API_KEY;


    const PLACE_ID =
        "ChIJXXXXXXXXXXXXXXXX";


    const url =
        `https://places.googleapis.com/v1/places/${PLACE_ID}`;


    const response =
        await fetch(url, {

            headers: {

                "Content-Type":
                    "application/json",

                "X-Goog-Api-Key":
                    API_KEY,

                "X-Goog-FieldMask":
                    [
                        "id",
                        "displayName",
                        "rating",
                        "userRatingCount",
                        "reviews",
                        "googleMapsLinks"
                    ].join(",")

            }

        });


    if (!response.ok) {

        const error =
            await response.text();

        return new Response(

            JSON.stringify({
                error: "Google Places API error",
                details: error
            }),

            {
                status: 500,

                headers: {
                    "Content-Type":
                        "application/json"
                }

            }

        );

    }


    const place =
        await response.json();


    const reviews =
        (place.reviews || [])
            .map(review => ({

                authorName:
                    review.authorAttribution
                        ?.displayName ||
                    "Cliente de Google",

                rating:
                    review.rating || 0,

                text:
                    review.text?.text ||
                    "",

                relativeTime:
                    review.relativePublishTimeDescription ||
                    "",

                googleMapsUri:
                    review.googleMapsUri ||
                    ""

            }));


    return new Response(

        JSON.stringify({

            rating:
                place.rating || 0,

            userRatingCount:
                place.userRatingCount || 0,

            reviews,

            reviewsUri:
                place.googleMapsLinks
                    ?.reviewsUri ||
                "https://www.google.com/maps/place/Peluqueria+Anita/"

        }),

        {

            headers: {

                "Content-Type":
                    "application/json",

                "Cache-Control":
                    "public, max-age=3600"

            }

        }

    );

}