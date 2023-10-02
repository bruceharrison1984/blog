export const BackgroundEffect = () => (
  <div className="absolute inset-x-0 -z-[99] h-screen blur-3xl">
    <svg height="100%" width="100%">
      <defs>
        <linearGradient id="0" x1="0.27" y1="0.06" x2="0.73" y2="0.94">
          <stop offset="3%" stopColor="rgba(43, 107, 177, 0.4)" />
          <stop offset="11%" stopColor="rgba(43, 107, 177, 0.3)" />
          <stop offset="19%" stopColor="rgba(43, 108, 176, 0.2)" />
          <stop offset="35%" stopColor="rgba(43, 108, 176, 0)" />
        </linearGradient>
        <linearGradient id="1" x1="0.77" y1="0.08" x2="0.23" y2="0.92">
          <stop offset="0%" stopColor="rgba(0, 51, 255, 0.28)" />
          <stop offset="25%" stopColor="rgba(161, 187, 204, 0.21)" />
          <stop offset="50%" stopColor="rgba(0, 51, 255, 0.14)" />
          <stop offset="100%" stopColor="rgba(0, 51, 255, 0)" />
        </linearGradient>
        <linearGradient id="2" x1="0.65" y1="0.98" x2="0.35" y2="0.02">
          <stop offset="0%" stopColor="rgba(0, 51, 255, 0.16)" />
          <stop offset="25%" stopColor="rgba(177, 105, 255, 0.12)" />
          <stop offset="50%" stopColor="rgba(242, 0, 232, 0.08)" />
          <stop offset="100%" stopColor="rgba(255, 0, 0, 0)" />
        </linearGradient>
      </defs>
      <rect fill="url(#0)" height="100%" width="100%" />
      <rect fill="url(#1)" height="100%" width="100%" />
      <rect fill="url(#2)" height="100%" width="100%" />
    </svg>
  </div>
);
