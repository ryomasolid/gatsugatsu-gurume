import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const CX = process.env.GOOGLE_CUSTOM_SEARCH_CX;

/**
 * 画像検索の実行
 */
const fetchImage = async (query: string): Promise<string | null> => {
  if (!API_KEY || !CX) return null;

  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(
      query
    )}&searchType=image&num=1`
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.items?.[0]?.link || null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const imageUrl = await fetchImage(q);
    console.log(imageUrl);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Custom Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}