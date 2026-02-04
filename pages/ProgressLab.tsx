
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  History, 
  Download, 
  RefreshCw,
  Send,
  Zap
} from 'lucide-react';
import { editProgressPhoto } from '../services/geminiService';

const ProgressLab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setIsProcessing(true);
    setError(null);
    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];
      
      const result = await editProgressPhoto(base64Data, mimeType, prompt);
      
      if (result) {
        setEditedImage(result);
      } else {
        setError("The system could not process this image. Please try a different request.");
      }
    } catch (err) {
      setError("An error occurred while connecting to the lab.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setEditedImage(null);
    setPrompt("");
    setError(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-zinc-900 tracking-tight uppercase italic">Progress Lab</h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto italic font-medium">
          Use the <span className="text-zinc-900 font-bold">Visual Improvement</span> tool to tidy up your photos. You can hide a messy background or brighten the colours.
        </p>
      </div>

      {!selectedImage ? (
        <div className="bg-white h-[400px] rounded-[40px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center space-y-6 hover:border-zinc-900 transition-all group shadow-sm">
          <div className="p-6 bg-zinc-50 rounded-full group-hover:bg-zinc-100 transition-colors">
            <Upload size={40} className="text-zinc-400 group-hover:text-zinc-900" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-zinc-900 uppercase italic">Upload your photo</p>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Standard image files supported</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-zinc-200"
          >
            Select photo
          </button>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-zinc-100 rounded-[32px] overflow-hidden border border-zinc-200 shadow-lg">
              <img 
                src={editedImage || selectedImage} 
                alt="Progress" 
                className="w-full h-full object-cover"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-zinc-900/10 border-t-zinc-900 rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-zinc-900 animate-pulse" size={24} />
                  </div>
                  <p className="text-zinc-900 font-black text-xl animate-pulse uppercase italic">Improving image...</p>
                  <p className="text-zinc-400 text-xs mt-2 font-bold uppercase tracking-widest">Applying visual changes</p>
                </div>
              )}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                {editedImage ? 'New photo' : 'Original photo'}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={reset}
                className="flex-1 py-4 rounded-2xl bg-white text-zinc-400 font-bold border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
              >
                <RefreshCw size={16} />
                Start again
              </button>
              {editedImage && (
                <button className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest">
                  <Download size={16} />
                  Save photo
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[48px] border border-zinc-200 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-900 rounded-2xl shadow-lg">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight text-zinc-900">Image Editor</h3>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">How to change the photo</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: 'Remove the messy background', 'Make the lighting brighter'..."
                className="w-full h-32 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-300 resize-none shadow-inner"
              />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Common requests</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Brighten the room",
                  "Black and white style",
                  "Hide background clutter",
                  "Vibrant colours",
                  "Softer lighting"
                ].map((s) => (
                  <button 
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-black text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition-all uppercase tracking-widest"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest">
                {error}
              </div>
            )}

            <button 
              onClick={handleEdit}
              disabled={isProcessing || !prompt}
              className="w-full py-6 rounded-[32px] premium-gradient text-white font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? "Wait a moment..." : "Create new image"}
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressLab;
