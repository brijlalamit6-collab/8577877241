
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';

const AnalyzeImage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('What is in this image?');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = useCallback((file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    setResult('');
    setError('');
  }, []);

  const handleSubmit = async () => {
    if (!prompt || !imageFile) {
      setError('Please provide an image and a prompt.');
      return;
    }
    setLoading(true);
    setResult('');
    setError('');
    try {
      const analysis = await analyzeImage(prompt, imageFile);
      setResult(analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-200">Analyze Image</h2>
      <ImageUploader onImageSelect={handleImageSelect} imagePreview={imagePreview} />
      
      <div>
        <label htmlFor="prompt-analyze" className="block text-sm font-medium text-gray-400 mb-1">
          Your Question
        </label>
        <textarea
          id="prompt-analyze"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., What is in this image?"
          className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows={2}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !imageFile || !prompt}
        className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300"
      >
        {loading ? <><Spinner /> Analyzing...</> : 'Analyze Image'}
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}

      {result && (
        <div className="bg-gray-700 p-4 rounded-lg mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Analysis Result:</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
};

export default AnalyzeImage;
