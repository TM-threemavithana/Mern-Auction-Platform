
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
;
import { Hero } from "./Hero.jsx";


const Home = () => {
  return (
    <div className="bg-slate-50">
      <Hero />
      <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:py-14">
        <FeaturedAuctions />
        <UpcomingAuctions />
        <Leaderboard />
      </main>
    </div>
  );
};

export default Home;
