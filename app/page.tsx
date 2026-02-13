import { headers } from "next/headers";
import WelcomeClient from "./WelcomeClient";

const WHOP_API_KEY = process.env.WHOP_API_KEY!;

const PRODUCTS: Record<string, string> = {
  free: "prod_OVVaWf1nemJrp",
  maxbet: "prod_12U89lKiPpVxP",
  premium: "prod_o1jjamUG8rP8W",
  props: "prod_RYRii4L26sK9m",
  highrollers: "prod_bNsUIqwSfzLzU",
};

function decodeWhopToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString()
    );
    console.log("[RWTW] Token payload:", JSON.stringify(payload));
    return (payload.sub as string) || null;
  } catch (e) {
    console.error("[RWTW] Token decode failed:", e);
    return null;
  }
}

async function checkProductAccess(
  userId: string,
  productId: string
): Promise<boolean> {
  try {
    const url = `https://api.whop.com/api/v1/users/${userId}/access/${productId}`;
    console.log("[RWTW] Checking access:", url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${WHOP_API_KEY}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    console.log(`[RWTW] Access ${productId}: status=${res.status}`, JSON.stringify(data));

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

  const userToken =
    headersList.get("x-whop-user-token") ||
    headersList.get("X-Whop-User-Token");

  console.log("[RWTW] Token present:", !!userToken);
  if (userToken) {
    console.log("[RWTW] Token preview:", userToken.substring(0, 40) + "...");
  }

  let access = {
    free: false,
    maxbet: false,
    premium: false,
    props: false,
    highrollers: false,
  };
  let authenticated = false;

  if (userToken) {
    const userId = decodeWhopToken(userToken);
    console.log("[RWTW] Decoded userId:", userId);

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

  console.log("[RWTW] Final access:", JSON.stringify(access));
  console.log("[RWTW] Authenticated:", authenticated);

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
