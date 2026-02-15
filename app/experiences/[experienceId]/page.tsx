import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import WelcomeClient from "./WelcomeClient";

const PRODUCTS: Record<string, string> = {
  maxbet: "prod_12U89lKiPpVxP",
  premium: "prod_o1jjamUG8rP8W",
  props: "prod_RYRii4L26sK9m",
  highrollers: "prod_bNsUIqwSfzLzU",
};

export default async function WelcomePage({
  params,
}: {
  params: { experienceId: string };
}) {
  let access = {
    maxbet: false,
    premium: false,
    props: false,
    highrollers: false,
  };
  let authenticated = false;

  try {
    const { userId } = await whopsdk.verifyUserToken(await headers());
    if (userId) {
      authenticated = true;

      // Check each product individually
      const checks = await Promise.allSettled(
        Object.entries(PRODUCTS).map(async ([key, productId]) => {
          try {
            const memberships = await whopsdk.memberships.list({
              user_ids: [userId],
              product_ids: [productId],
              valid: true,
            });
            const hasAccess = memberships.data && memberships.data.length > 0;
            return { key, hasAccess };
          } catch {
            return { key, hasAccess: false };
          }
        })
      );

      checks.forEach((result) => {
        if (result.status === "fulfilled") {
          access[result.value.key as keyof typeof access] =
            result.value.hasAccess;
        }
      });
    }
  } catch (e) {
    // Not authenticated — show default state with all purchase links
    console.log("Auth check failed:", e);
  }

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
