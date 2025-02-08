import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Video Thumbnail */}
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </span>
        </div>

        {/* Video Details */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            {video.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {video.views} views • {video.uploadDate}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
