import React from 'react'
import { useState } from "react";

const Transcript = ({ transcript }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter transcript by search term
  const filteredTranscript = transcript.filter((line) =>
    line.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Transcript
      </h2>

      {/* Search Bar for Transcript */}
      <input
        type="text"
        placeholder="Search transcript..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md mb-3 dark:bg-gray-800 dark:text-white"
      />

      {/* Display Transcript */}
      <div className="space-y-2">
        {filteredTranscript.length > 0 ? (
          filteredTranscript.map((line, index) => (
            <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-blue-500">{line.timestamp}</span>{" "}
              {line.text}
            </p>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default Transcript;
