import { whopsdk } from "@/lib/whop-sdk";
import WelcomeClient from "./WelcomeClient";

const PRODUCTS = {
  maxbet: "prod_12U89lKiPpVxP",
  premium: "prod_o1jjamUG8rP8W",
  props: "prod_RYRii4L26sK9m",
  highrollers: "prod_bNsUIqwSfzLzU",
};

export default async function WelcomePage({
  params,
  searchParams,
}: {
  params: { experienceId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let access = {
    maxbet: false,
    premium: false,
    props: false,
    highrollers: false,
  };
  let authenticated = false;

  try {
    // Try to get the user from Whop headers
    const user = await whopsdk.verifyToken(params.experienceId);
    if (user) {
      authenticated = true;
      // Check access for each product
      const checks = await Promise.allSettled(
        Object.entries(PRODUCTS).map(async ([key, productId]) => {
          try {
            const hasAccess = await whopsdk.checkUserAccess({
              userId: user.userId,
              productId,
            });
            return { key, hasAccess: !!hasAccess };
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
    // Not authenticated or error - show default state
    console.log("Auth check failed:", e);
  }

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
