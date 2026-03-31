export const dynamic = "force-dynamic";

const GIST_ID = process.env.GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Simple in-memory cache
let cachedCount: number | null = null;
let cacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function getCount(): Promise<number> {
  const now = Date.now();
  
  // Return cached value if still fresh
  if (cachedCount !== null && now - cacheTime < CACHE_DURATION) {
    return cachedCount;
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const data = await res.json();
    const content = JSON.parse(data.files["downloads.json"].content);
    const count = content.count || 0;
    
    // Update cache
    cachedCount = count;
    cacheTime = now;
    
    return count;
  } catch (error) {
    console.error("Failed to get count:", error);
    return cachedCount ?? 0;
  }
}

async function incrementCount(): Promise<number> {
  try {
    const current = await getCount();
    const newCount = current + 1;
    const newContent = JSON.stringify({ count: newCount });

    if (!newContent || newContent.length === 0) {
      throw new Error("Content cannot be empty");
    }

    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          "downloads.json": {
            content: newContent,
          },
        },
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`GitHub API error: ${JSON.stringify(error)}`);
    }

    // Update cache immediately after successful increment
    cachedCount = newCount;
    cacheTime = Date.now();

    return newCount;
  } catch (error) {
    console.error("Failed to increment count:", error);
    return cachedCount ?? 0;
  }
}

export async function GET() {
  const count = await getCount();
  return Response.json({ count });
}

export async function POST() {
  const count = await incrementCount();
  return Response.json({ count });
}
