import { MainContainer } from "~/components/bible/MainContainer";
import { getCurrentSeason } from "~/lib/liturgy";

export default function Home() {
  const season = getCurrentSeason();

  return <MainContainer season={season} />;
}
