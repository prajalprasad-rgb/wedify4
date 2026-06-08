import { LandingPage } from "@/components/marketing/landing-page";
import { getPublicContent } from "@/lib/public-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const content = await getPublicContent();
  return <LandingPage content={content} />;
}
