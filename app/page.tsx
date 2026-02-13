import { headers } from "next/headers";
import { jwtVerify, createRemoteJWKSet } from "jose";
import WelcomeClient from "./WelcomeClient";

const WHOP_API_KEY = process.env.WHOP_API_KEY!;

const PRODUCTS: Record<string, string> = {
  free: "prod_OVVaWf1nemJrp",
  maxbet: "prod_12U89lKiPpVxP",
  premium: "prod_o1jjamUG8rP8W",
  props: "prod_RYRii4L26sK9m",
  highrollers: "prod_bNsUIqwSfzLzU",
};

const JWKS = createRemoteJWKSet(
  new URL("https://api.whop.com/.well-known/jwks.json")
);

async function verifyWhopToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS);
    console.log("[RWTW] Token payload:", JSON.stringify(payload));
    return (payload.sub as string) || null;
  } catch (e) {
    console.error("[RWTW] Token verification failed:", e);
    // Try decoding without verification as fallback
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64url").toString()
        );
        console.log("[RWTW] Decoded token payload (unverified):", JSON.stringify(payload));
        return (payload.sub as string) || null;
      }
    } catch (e2) {
      console.error("[RWTW] Fallback decode failed:", e2);
    }
    return null;
  }
}

async function checkProductAccess(
  userId: string,
  productId: string
): Promise<boolean> {
  try {
    // Correct endpoint: GET /users/{id}/access/{resource_id}
    const url = `https://api.whop.com/api/v1/users/${userId}/access/${productId}`;
    console.log("[RWTW] Checking access:", url);
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${WHOP_API_KEY}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    console.log(`[RWTW] Access check ${productId}:`, JSON.stringify(data));
    
    if (!res.ok) return false;
    return data.has_access === true;
  } catch (e) {
    console.error(`[RWTW] Access check failed for ${productId}:`, e);
    return false;
  }
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  
  // Log all headers for debugging
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = key.toLowerCase().includes("token") 
      ? value.substring(0, 30) + "..." 
      : value;
  });
  console.log("[RWTW] All headers:", JSON.stringify(allHeaders));

  const userToken =
    headersList.get("x-whop-user-token") ||
    headersList.get("X-Whop-User-Token");

  console.log("[RWTW] User token present:", !!userToken);

  let access = {
    free: false,
    maxbet: false,
    premium: false,
    props: false,
    highrollers: false,
  };
  let authenticated = false;

  if (userToken) {
    const userId = await verifyWhopToken(userToken);
    console.log("[RWTW] Resolved userId:", userId);

    if (userId) {
      authenticated = true;
      const results = await Promise.all(
        Object.entries(PRODUCTS).map(async ([key, prodId]) => {
          const hasAccess = await checkProductAccess(userId, prodId);
          return [key, hasAccess] as [string, boolean];
        })
      );
      access = Object.fromEntries(results) as typeof access;
    }
  }

  console.log("[RWTW] Final access state:", JSON.stringify(access));
  console.log("[RWTW] Authenticated:", authenticated);

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
