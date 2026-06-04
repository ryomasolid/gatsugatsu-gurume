import { NextResponse } from "next/server";
import z from "zod";

export const RequestSchema = z.object({
  method: z.enum(["getLines", "getStations"]),
  prefecture: z.string()
})

export const ResponseSchema = z.object({
  response:z.object({
    line: z.array(z.string())
  })
})

export async function GET(request:Request) {
  try {
    const { searchParams } = new URL(request.url);

    const result = RequestSchema.safeParse({
      method: searchParams.get('method'),
      prefecture: searchParams.get('prefecture')
    })

    if(!result.success){
      return NextResponse.json(
        { error: "リクエストが不正です", details: result.error },
        { status: 400 }
      )
    }

    const { method, prefecture } = result.data
    const heartRailsParams = new URLSearchParams({
      method: method,
      prefecture: prefecture,
    });
    const url = `https://express.heartrails.com/api/json?${heartRailsParams}`;

    const res = await fetch(url)

    if(!res.ok){
      return NextResponse.json({ error: '都道府県通信エラー' }, { status: res.status });
    }

    const data = await res.json()

    const dataResult = ResponseSchema.safeParse(data)
    if(dataResult.success){
      return NextResponse.json(dataResult.data)
    }

    return NextResponse.json({})
  } catch (e) {
    return NextResponse.json({error:'サーバー内部エラー'},{status:500})    
  }
}