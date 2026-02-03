import React, { useState, useRef } from "react";
import { Image, Send, X, Paperclip, Mic } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [fileType, setFileType] = useState("image/*");
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const { sendMessage } = useChatStore();

  // ================= FILE HANDLER =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (file.type.startsWith("image/")) {
        setImagePreview(reader.result);
      } else if (file.type.startsWith("audio/")) {
        setAudioPreview(reader.result);
      } else {
        toast.success(`File selected: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAudio = () => {
    setAudioPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ================= VOICE RECORD =================
  const handleVoiceRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const reader = new FileReader();
        reader.onloadend = () => setAudioPreview(reader.result);
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      toast.error("Microphone access denied");
    }
  };

  // ================= SEND MESSAGE =================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !audioPreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        audio: audioPreview,
      });

      setText("");
      setImagePreview(null);
      setAudioPreview(null);
      setIsRecording(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  const handleCameraClick = () => {
    setFileType("image/*");
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
    setShowAttachMenu(false);
  };

  return (
    <div className="p-3 sm:p-4 w-full relative">
      {/* ================= PREVIEWS ================= */}
      {imagePreview && (
        <div className="mb-3">
          <div className="relative w-20">
            <img
              src={imagePreview}
              className="w-20 h-20 rounded-lg object-cover border border-zinc-700"
              alt="preview"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-base-300 rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {audioPreview && (
        <div className="mb-3 relative w-fit">
          <audio controls src={audioPreview} />
          <button
            onClick={removeAudio}
            className="absolute -top-2 -right-2 bg-base-300 rounded-full w-5 h-5 flex items-center justify-center"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ================= ATTACH MENU ================= */}
      {showAttachMenu && (
        <div className="absolute bottom-20 left-3 bg-base-200 rounded-xl shadow-lg w-56 z-50 overflow-hidden">
          <button
            className="w-full px-4 py-3 hover:bg-base-300"
            onClick={() => {
              setFileType("image/*,video/*");
              fileInputRef.current.removeAttribute("capture");
              fileInputRef.current.click();
              setShowAttachMenu(false);
            }}
          >
            📷 Image / Video
          </button>

          <button
            className="w-full px-4 py-3 hover:bg-base-300"
            onClick={handleCameraClick}
          >
            📸 Camera
          </button>

          <button
            className="w-full px-4 py-3 hover:bg-base-300"
            onClick={() => {
              setFileType("*");
              fileInputRef.current.removeAttribute("capture");
              fileInputRef.current.click();
              setShowAttachMenu(false);
            }}
          >
            📄 Document
          </button>

          <button
            className="w-full px-4 py-3 hover:bg-base-300"
            onClick={() => {
              setFileType("audio/*");
              fileInputRef.current.removeAttribute("capture");
              fileInputRef.current.click();
              setShowAttachMenu(false);
            }}
          >
            🎧 Audio
          </button>
        </div>
      )}

      {/* ================= INPUT BAR ================= */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 w-full"
      >
        {/* LEFT BUTTONS */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="btn btn-circle"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            className="btn btn-circle"
            onClick={() => {
              setFileType("image/*");
              fileInputRef.current.removeAttribute("capture");
              fileInputRef.current.click();
            }}
          >
            <Image size={20} />
          </button>
        </div>

        {/* TEXT INPUT */}
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 min-w-0 input input-bordered rounded-lg input-sm sm:input-md"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* MIC */}
        <button
          type="button"
          onClick={handleVoiceRecord}
          className={`btn btn-circle shrink-0 ${
            isRecording ? "text-red-500" : ""
          }`}
        >
          <Mic size={20} />
        </button>

        {/* SEND */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview && !audioPreview}
          className="btn btn-circle btn-sm shrink-0"
        >
          <Send size={20} />
        </button>

        {/* HIDDEN FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={fileType}
          onChange={handleFileChange}
        />
      </form>
    </div>
  );
};

export default MessageInput;
