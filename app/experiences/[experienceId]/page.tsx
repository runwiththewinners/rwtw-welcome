import { headers } from "next/headers";
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

      const checks = await Promise.allSettled(
        Object.entries(PRODUCTS).map(async ([key, productId]) => {
          try {
            const result = await whopsdk.users.checkAccess(params.experienceId, {
              id: userId,
            });
            return { key, hasAccess: !!result };
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
    console.log("Auth check failed:", e);
  }

  return <WelcomeClient access={access} authenticated={authenticated} />;
}
