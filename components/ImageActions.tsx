import React from 'react';

interface ImageActionsProps {
  imageDataUrl: string;
  prompt: string;
}

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);


const ImageActions: React.FC<ImageActionsProps> = ({ imageDataUrl, prompt }) => {
  const canShare = typeof navigator.share === 'function' && typeof navigator.canShare === 'function';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    const safePrompt = prompt.length > 30 ? prompt.substring(0, 30) : prompt;
    const fileName = safePrompt.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'gemini-image';
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const safePrompt = prompt.length > 30 ? prompt.substring(0, 30) : prompt;
      const fileName = safePrompt.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'gemini-image';
      const file = new File([blob], `${fileName}.png`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Image from Gemini Studio',
          text: `Check out this image I created: "${prompt}"`,
        });
      } else {
        alert("Your browser doesn't support sharing this file.");
      }
    } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            console.error('Error sharing image:', error);
            alert('An error occurred while trying to share the image.');
        }
    }
  };

  return (
    <div className="flex justify-center gap-4 mt-2">
      <button
        onClick={handleDownload}
        className="flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        aria-label="Download Image"
      >
        <DownloadIcon />
        Download
      </button>
      {canShare && (
        <button
          onClick={handleShare}
          className="flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          aria-label="Share Image"
        >
          <ShareIcon />
          Share
        </button>
      )}
    </div>
  );
};

export default ImageActions;
