
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
;
import { Hero } from "./Hero.jsx";


const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedAuctions />
      <UpcomingAuctions />
      <Leaderboard />
    </div>
  );
};

export default Home;