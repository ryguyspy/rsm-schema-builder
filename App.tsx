
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { WizardForm } from './components/WizardForm';
import { CodeOutput } from './components/CodeOutput';
import { SchemaType, SchemaFormData, GeneratedSchema } from './types';
import { generateSchema } from './services/geminiService';
import { Sparkles, ArrowLeft, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<'selection' | 'form' | 'result'>('selection');
  const [selectedType, setSelectedType] = useState<SchemaType | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (type: SchemaType) => {
    setSelectedType(type);
    setStep('form');
  };

  const handleFormSubmit = async (formData: SchemaFormData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSchema(formData.type, formData.responses);
      setResult(data);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError('Failed to generate schema. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('selection');
    setSelectedType(null);
    setResult(null);
    setError(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Schema Wizard AI
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            Generate perfectly structured JSON-LD schema to help search engines understand your content.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[400px]">
          {step === 'selection' && (
            <div className="p-6 sm:p-10">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Choose Schema Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(SchemaType).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="flex flex-col items-start p-5 text-left border border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group shadow-sm"
                  >
                    <span className="text-base font-bold text-slate-800 group-hover:text-indigo-700">{type}</span>
                    <span className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {type === SchemaType.LOCAL_BUSINESS && "For shops, offices, and services with a physical location."}
                      {type === SchemaType.WEB_PAGE && "Standard structured data for landing and general web pages."}
                      {type === SchemaType.ARTICLE && "For blog posts, news articles, and informational content."}
                      {type === SchemaType.PRODUCT && "Product data including price, availability, and reviews."}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'form' && selectedType && (
            <div className="p-6 sm:p-8">
              <button 
                onClick={() => setStep('selection')}
                className="flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Change Type
              </button>
              <WizardForm 
                type={selectedType} 
                onSubmit={handleFormSubmit} 
                isLoading={loading} 
              />
            </div>
          )}

          {step === 'result' && result && (
            <div className="p-6 sm:p-8">
               <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setStep('form')}
                  className="flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Edit Info
                </button>
                <button 
                  onClick={reset}
                  className="flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider"
                >
                  <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> New Schema
                </button>
              </div>
              <CodeOutput result={result} />
            </div>
          )}

          {error && (
            <div className="p-4 mx-6 my-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-slate-400 text-xs">
          Built with Gemini AI &bull; Optimize for Search Visibility
        </footer>
      </div>
    </Layout>
  );
};

export default App;
