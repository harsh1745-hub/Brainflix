import Playlist from "../Models/Playlist.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description, videos } = req.body;
    const playlist = new Playlist({ name, videos, description });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(401).json({ message: "playlist", error });
  }
};


export const getAllPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.find();
    res.status(201).json({ playlist });
  } catch (error) {
    res.status(400).json({ message: "Error getting in playlist:", error });
  }
};

export const getPlayListById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(400).json({ message: "playlist not found" });
    }
    res.status(200).json({ playlist });
  } catch (error) {
    res.status(400).json({ message: "Unexpected error", error });
  }
};

export const addToPlaylist = async (req, res) => {
  try {
    const { videoId, title, url } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(400).json({ message: "Playlist not found" });
    }
    playlist.video.push({ videoId, title, url });
    await playlist.save();
  } catch (error) {
    res
      .status(400)
      .json({ message: "Playlist Not found check one time more", error });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted succesfuly" });
  } catch (error) {}
};
