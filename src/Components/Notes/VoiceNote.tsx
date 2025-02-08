import React, { useState } from "react";

// Add type declarations for SpeechRecognition
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

const VoiceNote = ({ saveVoiceNote }) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    setText(event.results[0][0].transcript);
  };

  const startRecording = () => {
    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.stop();
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Voice Note</h2>
      <textarea
        className="w-full p-2 border rounded-md"
        value={text}
        readOnly
      />
      <div className="mt-2">
        {isRecording ? (
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={stopRecording}>
            Stop Recording
          </button>
        ) : (
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={startRecording}>
            Start Recording
          </button>
        )}
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => saveVoiceNote(text)}>
          Save
        </button>
      </div>
    </div>
  );
};

export default VoiceNote;
