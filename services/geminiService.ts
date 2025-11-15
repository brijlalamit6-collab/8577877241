import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Per coding guidelines, assume API_KEY is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeImage = async (prompt: string, image: File) => {
  const imagePart = await fileToGenerativePart(image);
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });
  
  return response.text;
};

export const editImage = async (prompt: string, image: File) => {
  const imagePart = await fileToGenerativePart(image);
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const firstPart = response.candidates?.[0]?.content?.parts[0];
  if (firstPart && firstPart.inlineData) {
    const mimeType = firstPart.inlineData.mimeType;
    const base64Data = firstPart.inlineData.data;
    return `data:${mimeType};base64,${base64Data}`;
  }
  
  throw new Error("No image was generated.");
};

export const generateImage = async (prompt: string, image?: File | null) => {
  if (image) {
    // Use gemini-2.5-flash-image for image-to-image generation
    const imagePart = await fileToGenerativePart(image);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts[0];
    if (firstPart && firstPart.inlineData) {
      const mimeType = firstPart.inlineData.mimeType;
      const base64Data = firstPart.inlineData.data;
      return `data:${mimeType};base64,${base64Data}`;
    }
    
    throw new Error("No image was generated from the reference image.");
  } else {
    // Original text-to-image logic using imagen
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });
    
    const generatedImage = response.generatedImages?.[0];
    if (generatedImage?.image?.imageBytes) {
        const base64Data = generatedImage.image.imageBytes;
        return `data:image/png;base64,${base64Data}`;
    }
    
    throw new Error("No image was generated from the prompt.");
  }
};
