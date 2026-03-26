const VideoIframe = ({ videoId, controls = false, muted = false }) => (
  <div className="relative object-contain w-full h-full overflow-hidden aspect-video">
    <iframe
      title="vimeo-player"
      src={`https://player.vimeo.com/video/${videoId}?${controls ? 'autoplay=0&loop=1&badge=1&autopause=1&texttrack=en' : 'autoplay=1&loop=1&autopause=0&background=1&controls=0'} ${muted ? '&muted=1' : ''}`}
      allow="autoplay; fullscreen; picture-in-picture"
      loading="lazy"
      className="absolute top-0 left-0 object-contain w-full h-full"
    />
  </div>
);

export default VideoIframe;
