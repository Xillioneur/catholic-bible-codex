import { MainContainer } from "~/components/bible/MainContainer";
import { getCurrentSeason } from "~/lib/liturgy";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const season = getCurrentSeason();
  
  // Pre-fetch the first page of verses on the server for sub-1s load
  // This populates the cache so useInfiniteQuery starts with data immediately
  void api.bible.getInfiniteVerses.prefetch({ limit: 50, translationCode: "WEBBE" });

  return (
    <HydrateClient>
      <MainContainer season={season} />
    </HydrateClient>
  );
}
