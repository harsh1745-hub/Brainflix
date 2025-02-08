import React from "react";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaPlay, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const socket = io("http://localhost:5000");

const extractVideoId = (url: string) => {
  const match = url.match(/(?:[?&]v=|youtu\.be\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

export default function LiveNotes() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const notesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("note", (data) => {
      setNotes((prev) => [...prev, data.note]);
      scrollToBottom();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("note");
    };
  }, []);

  const scrollToBottom = () => {
    notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startLiveNotes = () => {
    const extractedId = extractVideoId(videoUrl);
    if (!extractedId) return alert("Invalid YouTube URL!");
    
    setVideoId(extractedId);
    setNotes([]);
    setLoading(true);
    socket.emit("start_live_notes", { videoId: extractedId });
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            YouTube Live Notes
          </h1>
          <p className="text-gray-600">
            Paste a YouTube URL to generate real-time notes
          </p>
        </div>

        {/* URL Input Section */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="flex-1 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <motion.button
            onClick={startLiveNotes}
            disabled={!videoUrl || loading}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-4 rounded-lg flex items-center gap-2 text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPlay className="text-sm" />
            )}
            {loading ? "Processing..." : "Start"}
          </motion.button>
        </div>

        {/* Video and Notes Container */}
        {videoId && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Video Player */}
            <div className="md:w-2/3 bg-black rounded-xl overflow-hidden shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Live Notes Section */}
            <div className="md:w-1/3 bg-white rounded-xl shadow-xl p-6 h-[600px] flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Live Notes
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Notes will appear here as the video plays...
                  </p>
                ) : (
                  notes.map((note, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p className="text-gray-700">{note}</p>
                    </motion.div>
                  ))
                )}
                <div ref={notesEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="text-center">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              connected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {connected ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Connected to Live Notes
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                Disconnected
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

