import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';
import ImageActions from './ImageActions';
import ImageUploader from './ImageUploader';

const GenerateImage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A high-resolution photo of a robot holding a red skateboard');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File | null) => {
    setReferenceImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReferenceImagePreview(null);
    }
    setGeneratedImage(null);
    setError('');
  }, []);

  const handleSubmit = async () => {
    if (!prompt) {
      setError('Please provide a prompt.');
      return;
    }
    setLoading(true);
    setGeneratedImage(null);
    setError('');
    try {
      const newImage = await generateImage(prompt, referenceImageFile);
      setGeneratedImage(newImage);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-200">
        Generate Image with {referenceImageFile ? 'Nano Banana' : 'Imagen'}
      </h2>
      
      <div>
        <label htmlFor="prompt-generate" className="block text-sm font-medium text-gray-400 mb-1">
          Your Prompt
        </label>
        <textarea
          id="prompt-generate"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A robot holding a red skateboard"
          className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Reference Image (Optional)
        </label>
        <ImageUploader onImageSelect={handleImageSelect} imagePreview={referenceImagePreview} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !prompt}
        className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300"
      >
        {loading ? <><Spinner /> Generating...</> : 'Generate Image'}
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-center mb-2 text-gray-300">Generated Image</h3>
        <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
            {loading && <Spinner />}
            {!loading && generatedImage && <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg" />}
            {!loading && !generatedImage && <p className="text-gray-500">Result will appear here</p>}
        </div>
        {!loading && generatedImage && (
            <ImageActions imageDataUrl={generatedImage} prompt={prompt} />
        )}
      </div>
    </div>
  );
};

export default GenerateImage;
