import { HashLoader } from "react-spinners";

const Spinner = () => (
  <div className="flex min-h-[16rem] w-full flex-col items-center justify-center gap-4 px-4" role="status" aria-live="polite">
    <HashLoader size={42} color="#B7791F" aria-hidden="true" />
    <p className="text-sm font-medium text-slate-600">Loading…</p>
  </div>
);

export default Spinner;
