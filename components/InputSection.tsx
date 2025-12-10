import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Camera, Type, Upload, X } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (text: string, image?: string, mimeType?: string, userAllergies?: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [mode, setMode] = useState<'text' | 'image'>('image');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ base64: string; mime: string } | null>(null);
  const [userAllergies, setUserAllergies] = useState('');
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle camera stream lifecycle
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startStream = async () => {
      if (isCameraActive) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera error:", err);
          alert("Unable to access camera. Please ensure you have granted camera permissions.");
          setIsCameraActive(false);
        }
      }
    };

    if (isCameraActive) {
      startStream();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Content = result.split(',')[1];
      setImagePreview(result);
      setImageData({ base64: base64Content, mime: file.type });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageData(null);
    setIsCameraActive(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64Content = dataUrl.split(',')[1];
        
        setImagePreview(dataUrl);
        setImageData({ base64: base64Content, mime: 'image/jpeg' });
        setIsCameraActive(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'text' && !textInput.trim()) return;
    if (mode === 'image' && !imageData) return;

    onAnalyze(
      textInput,
      mode === 'image' ? imageData?.base64 : undefined,
      mode === 'image' ? imageData?.mime : undefined,
      userAllergies
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-700">
        <button
          onClick={() => { setMode('image'); setIsCameraActive(false); }}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
            mode === 'image' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Camera className="h-4 w-4" />
          <span>Scan Label</span>
        </button>
        <button
          onClick={() => { setMode('text'); setIsCameraActive(false); }}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
            mode === 'text' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Type className="h-4 w-4" />
          <span>Paste Text</span>
        </button>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
           <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Allergies (Optional)
            </label>
            <input
              type="text"
              value={userAllergies}
              onChange={(e) => setUserAllergies(e.target.value)}
              placeholder="e.g. Strawberries, Latex, specific dyes..."
              className="w-full px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Image Input Section */}
          {mode === 'image' && (
            <div className="space-y-4">
              
              {/* Option Selection State: No image, Camera not active */}
              {!imagePreview && !isCameraActive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-400 hover:text-emerald-500 cursor-pointer transition-all h-48 group"
                  >
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                        <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Upload Image</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP</p>
                  </div>

                  <div 
                    onClick={() => setIsCameraActive(true)}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-400 hover:text-emerald-500 cursor-pointer transition-all h-48 group"
                  >
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                        <Camera className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Use Camera</p>
                    <p className="text-xs text-slate-400 mt-1">Take a photo</p>
                  </div>
                </div>
              )}

              {/* Camera Active State */}
              {isCameraActive && (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] sm:aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-700">
                   <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                   <canvas ref={canvasRef} className="hidden" />
                   
                   <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-8 z-10">
                      <button 
                        type="button"
                        onClick={() => setIsCameraActive(false)} 
                        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-colors"
                        title="Cancel"
                      >
                          <X className="h-6 w-6" />
                      </button>
                      
                      <button 
                        type="button"
                        onClick={capturePhoto} 
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ring-4 ring-emerald-500/30"
                        title="Capture Photo"
                      >
                          <Camera className="h-8 w-8" />
                      </button>
                      
                      {/* Placeholder for symmetry */}
                      <div className="w-12 h-12 opacity-0"></div>
                   </div>
                </div>
              )}

              {/* Image Preview State */}
              {imagePreview && !isCameraActive && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/5 dark:bg-white/5">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {mode === 'text' && (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste the full list of ingredients here..."
              className="w-full h-48 p-4 text-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          )}

          <button
            type="submit"
            disabled={isLoading || (mode === 'text' && !textInput) || (mode === 'image' && !imageData) || isCameraActive}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Decode Ingredients</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};