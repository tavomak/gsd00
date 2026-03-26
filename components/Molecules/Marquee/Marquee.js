import Marquee from 'react-fast-marquee';

export const MarqueeComponent = ({
  children,
  speed = 180,
  autoFill = true,
}) => (
  <Marquee speed={speed} autoFill={autoFill}>
    {children || (
      <h2 className="flex gap-4 py-2 text-xs uppercase me-10">
        <span> Free Style </span>
        <span className="font-bold"> Branded Content</span>
      </h2>
    )}
  </Marquee>
);

export default MarqueeComponent;
