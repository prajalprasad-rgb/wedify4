import { LandingPage } from "@/components/marketing/landing-page";
import { getPublicContent } from "@/lib/public-content";

export default async function Home() {
  const content = await getPublicContent();
  return <LandingPage content={content} />;
}
