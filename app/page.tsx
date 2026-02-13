import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import WelcomeClient from "./experiences/[experienceId]/WelcomeClient";

const PRODUCTS: Record<string, string> = {
  maxbet: "prod_12U89lKiPpVxP",
  premium: "prod_o1jjamUG8rP8W",
  props: "prod_RYRii4L26sK9m",
  highrollers: "prod_bNsUIqwSfzLzU",
};

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const headersList = await headers();

  let access = {
    maxbet: false,
    premium: false,
    props: false,
    highrollers: false,
  };
  let authenticated = false;

  try {
    const result = await whopsdk.verifyUserToken(headersList, {
      dontThrow: true,
    });
    const userId = (result as any)?.userId ?? null;

    console.log("[RWTW-ROOT] verifyResult:", JSON.stringify(result));
    console.log("[RWTW-ROOT] userId:", userId);

    if (userId) {
      authenticated = true;

      const results = await Promise.all(
        Object.entries(PRODUCTS).map(async ([key, prodId]) => {
          try {
            const response = await whopsdk.users.checkAccess(prodId, {
              id: userId,
            });
            console.log(`[RWTW-ROOT] ${key}:`, JSON.stringify(response));
            return [key, response.has_access === true] as [string, boolean];
          } catch (e) {
            console.error(`[RWTW-ROOT] Error checking ${key}:`, e);
            return [key, false] as [string, boolean];
          }
        })
      );

      access = Object.fromEntries(results) as typeof access;
    }
  } catch (e) {
    console.error("[RWTW-ROOT] Auth error:", e);
  }

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
