import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const getTimeLeft = (startTime, endTime) => {
  const now = Date.now();
  const startDifference = new Date(startTime).getTime() - now;
  const endDifference = new Date(endTime).getTime() - now;
  const difference = startDifference > 0 ? startDifference : endDifference;
  if (difference <= 0) return null;
  return {
    type: startDifference > 0 ? "Starts in" : "Ends in",
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const Card = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(startTime, endTime));

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(startTime, endTime));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [startTime, endTime]);

  const timeText = timeLeft
    ? `${timeLeft.days}d ${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`
    : "Auction ended";

  return (
    <Link to={`/auction/item/${id}`} className="group min-w-0 basis-full rounded-lg bg-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)] xl:basis-[calc(25%-1.125rem)]">
      <img src={imgSrc} alt={title} width="400" height="300" loading="lazy" className="m-auto aspect-[4/3] w-full object-contain p-4 md:p-8" />
      <div className="min-w-0 px-3 pb-4 pt-2">
        <h2 className="truncate text-lg font-semibold group-hover:text-amber-700">{title}</h2>
        <p className="mt-2 text-sm text-stone-600">Starting bid <span className="font-bold text-amber-700">${Number(startingBid || 0).toFixed(2)}</span></p>
        <p className="mt-1 text-sm text-stone-600"><span className="font-medium">{timeLeft?.type || "Status"}</span> <span className="font-bold text-amber-700 tabular-nums">{timeText}</span></p>
      </div>
    </Link>
  );
};

Card.propTypes = { imgSrc: PropTypes.string, title: PropTypes.string.isRequired, startingBid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), startTime: PropTypes.string.isRequired, endTime: PropTypes.string.isRequired, id: PropTypes.string.isRequired };
export default Card;
