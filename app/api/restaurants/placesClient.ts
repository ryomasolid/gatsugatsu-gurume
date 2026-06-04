import { GooglePlace, GooglePlaceSchema } from "@/utils/restaurantHelpers";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.primaryType";

export const fetchPlaces = async (
  query: string,
  lat: number,
  lng: number
): Promise<GooglePlace[]> => {
  if (!GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is not set");
    return [];
  }

  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    console.error("Invalid coordinates:", { lat, lng });
    return [];
  }

  console.log("Fetching places with:", { query, lat, lng });

  const requestBody = {
    textQuery: query,
    languageCode: "ja",
    maxResultCount: 10,
    locationRestriction: {
      center: { latitude: lat, longitude: lng },
      radius: 1000.0,
    },
  };

  try {
    const response = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error("Google Places API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorBody,
        requestedCoords: { lat, lng },
      });
      return [];
    }

    const data = await response.json();
    const rawPlaces: unknown[] = data.places || [];

    console.log(`Found ${rawPlaces.length} places for query "${query}" at (${lat}, ${lng})`);

    return rawPlaces
      .map((p) => {
        const parsed = GooglePlaceSchema.safeParse(p);
        if (!parsed.success) {
          console.warn("Failed to parse place:", parsed.error);
        }
        return parsed.success ? parsed.data : null;
      })
      .filter((p): p is GooglePlace => p !== null);
  } catch (error) {
    console.error("Network error fetching places:", error);
    return [];
  }
};
