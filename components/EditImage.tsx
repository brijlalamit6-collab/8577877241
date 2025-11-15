import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import ImageActions from './ImageActions';

const EditImage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = useCallback((file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalImage(null);
    }
    setEditedImage(null);
    setError('');
  }, []);

  const handleSubmit = async () => {
    if (!prompt || !imageFile) {
      setError('Please provide an image and an editing instruction.');
      return;
    }
    setLoading(true);
    setEditedImage(null);
    setError('');
    try {
      const newImage = await editImage(prompt, imageFile);
      setEditedImage(newImage);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-200">Edit Image with Nano Banana</h2>
      <ImageUploader onImageSelect={handleImageSelect} imagePreview={originalImage} />
      
      <div>
        <label htmlFor="prompt-edit" className="block text-sm font-medium text-gray-400 mb-1">
          Editing Instruction
        </label>
        <input
          type="text"
          id="prompt-edit"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Add a retro filter"
          className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !imageFile || !prompt}
        className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300"
      >
        {loading ? <><Spinner /> Editing...</> : 'Edit Image'}
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="text-lg font-semibold text-center mb-2 text-gray-300">Original</h3>
          <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
            {originalImage ? <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" /> : <p className="text-gray-500">Upload an image</p>}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-center mb-2 text-gray-300">Edited</h3>
          <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
            {loading && <Spinner />}
            {!loading && editedImage && <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-lg" />}
            {!loading && !editedImage && <p className="text-gray-500">Result will appear here</p>}
          </div>
          {!loading && editedImage && (
            <ImageActions imageDataUrl={editedImage} prompt={prompt} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditImage;