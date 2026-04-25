import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/openfoodfacts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  try {

    const results = await searchProducts({ query, pageSize: 5 });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
