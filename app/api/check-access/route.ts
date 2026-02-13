import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const WHOP_API_KEY = process.env.WHOP_API_KEY!;

const PRODUCTS = {
  free: "prod_OVVaWf1nemJrp",
  maxbet: "prod_12U89lKiPpVxP",
  premium: "prod_o1jjamUG8rP8W",
  props: "prod_RYRii4L26sK9m",
  highrollers: "prod_bNsUIqwSfzLzU",
};

// Whop JWKS endpoint for token verification
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

export async function GET(req: NextRequest) {
  // Get the user token from the header (passed by Whop iframe)
  const userToken = req.headers.get("x-whop-user-token");

  if (!userToken) {
    // No token = not authenticated, return all false
    return NextResponse.json({
      authenticated: false,
      access: {
        free: false,
        maxbet: false,
        premium: false,
        props: false,
        highrollers: false,
      },
    });
  }

  const userId = await verifyWhopToken(userToken);

  if (!userId) {
    return NextResponse.json({
      authenticated: false,
      access: {
        free: false,
        maxbet: false,
        premium: false,
        props: false,
        highrollers: false,
      },
    });
  }

  // Check access to all products in parallel
  const [free, maxbet, premium, props, highrollers] = await Promise.all([
    checkProductAccess(userId, PRODUCTS.free),
    checkProductAccess(userId, PRODUCTS.maxbet),
    checkProductAccess(userId, PRODUCTS.premium),
    checkProductAccess(userId, PRODUCTS.props),
    checkProductAccess(userId, PRODUCTS.highrollers),
  ]);

  return NextResponse.json({
    authenticated: true,
    userId,
    access: { free, maxbet, premium, props, highrollers },
  });
}
