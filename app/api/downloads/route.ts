import { kv } from "@vercel/kv";

const DOWNLOAD_KEY = "download_count";

// Force dynamic — never cache this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = (await kv.get<number>(DOWNLOAD_KEY)) ?? 0;
    return Response.json({ count });
  } catch (error) {
    return Response.json(
      { count: 0, error: "Failed to read count" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const count = await kv.incr(DOWNLOAD_KEY);
    return Response.json({ count });
  } catch (error) {
    return Response.json(
      { count: 0, error: "Failed to increment count" },
      { status: 500 }
    );
  }
}
