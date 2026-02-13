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
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "urn:whop:oauth",
    });
    return (payload.sub as string) || null;
  } catch (e) {
    console.error("Token verification failed:", e);
    return null;
  }
}

async function checkProductAccess(
  userId: string,
  productId: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.whop.com/api/v5/app/users/${userId}/check_access?resource_id=${productId}`,
      {
        headers: {
          Authorization: `Bearer ${WHOP_API_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.has_access === true;
  } catch (e) {
    console.error(`Access check failed for ${productId}:`, e);
    return false;
  }
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  const userToken =
    headersList.get("x-whop-user-token") ||
    headersList.get("X-Whop-User-Token");

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

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
