
import React, { useState, useCallback } from 'react';
import { analyzePlantImage } from '../services/geminiService';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface PlantIdentifierProps {
  onAnalysisComplete: (plantInfo: string) => void;
}

const PlantIdentifier: React.FC<PlantIdentifierProps> = ({ onAnalysisComplete }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult('');
      setError('');
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult('');
    try {
      const result = await analyzePlantImage(imageFile);
      setAnalysisResult(result);
      onAnalysisComplete(result);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, onAnalysisComplete]);

  return (
    <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-500/20">
      <h2 className="text-2xl font-semibold mb-4 text-green-300 flex items-center gap-3">
        <SparklesIcon className="w-6 h-6" />
        Identify a Plant
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center bg-gray-900/50 p-6 rounded-xl border-2 border-dashed border-gray-600 hover:border-green-500 transition-colors duration-300">
          <input
            type="file"
            id="plant-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading}
          />
          <label
            htmlFor="plant-upload"
            className={`cursor-pointer flex flex-col items-center text-center p-4 ${isLoading ? 'opacity-50' : ''}`}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Plant preview" className="max-h-48 w-auto rounded-lg mb-4 object-cover" />
            ) : (
              <UploadIcon className="w-12 h-12 text-gray-500 mb-3" />
            )}
            <span className="text-green-400 font-semibold">{imageFile ? imageFile.name : 'Click to upload a photo'}</span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, or WEBP</span>
          </label>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400 mb-4 flex-grow">
            Upload a clear picture of a plant, and our AI will identify it and provide detailed care instructions.
          </p>
          <button
            onClick={handleAnalyzeClick}
            disabled={!imageFile || isLoading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : 'Analyze Plant'}
          </button>
          {error && <p className="text-red-400 mt-2 text-sm text-center">{error}</p>}
        </div>
      </div>
      {analysisResult && (
        <div className="mt-6 bg-gray-900/70 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-green-400">Analysis Result</h3>
          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300 prose-headings:text-green-300"
            dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} // Simple markdown to html
          />
        </div>
      )}
    </section>
  );
};

export default PlantIdentifier;
