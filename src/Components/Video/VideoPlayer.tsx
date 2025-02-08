import React from "react";
import ReactPlayer from "react-player/youtube";

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl">
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="100%"
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
