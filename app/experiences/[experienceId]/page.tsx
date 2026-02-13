import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import WelcomeClient from "./WelcomeClient";

const PRODUCTS: Record<string, string> = {
  free: "prod_OVVaWf1nemJrp",
  maxbet: "prod_12U89lKiPpVxP",
  premium: "prod_o1jjamUG8rP8W",
  props: "prod_RYRii4L26sK9m",
  highrollers: "prod_bNsUIqwSfzLzU",
};

export const dynamic = "force-dynamic";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const headersList = await headers();

  let access = {
    free: false,
    maxbet: false,
    premium: false,
    props: false,
    highrollers: false,
  };
  let authenticated = false;

  try {
    const { userId } = await whopsdk.verifyUserToken(headersList, {
      dontThrow: true,
    });

    console.log("[RWTW] userId:", userId);
    console.log("[RWTW] experienceId:", experienceId);

    if (userId) {
      authenticated = true;

      const results = await Promise.all(
        Object.entries(PRODUCTS).map(async ([key, prodId]) => {
          try {
            const response = await whopsdk.users.checkAccess(prodId, {
              id: userId,
            });
            console.log(`[RWTW] ${key} (${prodId}):`, JSON.stringify(response));
            return [key, response.has_access === true] as [string, boolean];
          } catch (e) {
            console.error(`[RWTW] Error checking ${key}:`, e);
            return [key, false] as [string, boolean];
          }
        })
      );

      access = Object.fromEntries(results) as typeof access;
    }
  } catch (e) {
    console.error("[RWTW] Auth error:", e);
  }

  console.log("[RWTW] Final access:", JSON.stringify(access));

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
