import { NextResponse } from "next/server";
import { z } from "zod";

export const WikipediaSchema = z.object({
  query: z.object({
    pages: z.record(
      z.string(),
      z.object({
        pageid: z.number(),
        title: z.string(),
        thumbnail: z.object({
          source: z.string(),
          width: z.number(),
          height: z.number(),
        }).optional(),
      })
    ),
  }),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get("station") ?? "";

    if(!station){
      return NextResponse.json({ error: '駅名が正しく選択されていません' },{ status: 400 });
    }

    const wikiParams = new URLSearchParams({
      action: "query",
      titles: `${station}駅`,
      prop: "pageimages",
      format: "json",
      pithumbsize: "1000",
      origin: "*",
    });
    const wikiUrl = `https://ja.wikipedia.org/w/api.php?${wikiParams}`;

    const res = await fetch(wikiUrl);
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Wikipedia通信エラー' }, { status: res.status });
    }
    
    const data = await res.json() ;
    const result = WikipediaSchema.safeParse(data)

    if (result.success) {
      const pages = result.data.query.pages;
      const firstPage = Object.values(pages)[0]; 
      const imageUrl = firstPage?.thumbnail?.source ?? null;

      return NextResponse.json({ imageUrl });
    }

    return NextResponse.json({ imageUrl: null, error: "データ形式が不正です" });

  } catch (e) {
    return NextResponse.json({ error: "サーバー内部エラー" }, { status: 500 });
  }
}