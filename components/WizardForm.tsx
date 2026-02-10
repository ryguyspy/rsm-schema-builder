
import React, { useState } from 'react';
import { SchemaType, Question, SchemaFormData } from '../types';
import { Loader2 } from 'lucide-react';

interface WizardFormProps {
  type: SchemaType;
  onSubmit: (data: SchemaFormData) => void;
  isLoading: boolean;
}

export const WizardForm: React.FC<WizardFormProps> = ({ type, onSubmit, isLoading }) => {
  const getQuestions = (type: SchemaType): Question[] => {
    const common = [
      { id: 'name', label: 'Name', type: 'text' as const, required: true, placeholder: 'e.g. My Awesome Company' },
      { id: 'url', label: 'URL', type: 'url' as const, required: true, placeholder: 'https://example.com' },
      { id: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'A short overview...' },
    ];

    switch (type) {
      case SchemaType.LOCAL_BUSINESS:
        return [
          ...common,
          { id: 'address', label: 'Street Address', type: 'text' as const, required: true, placeholder: '123 Main St' },
          { id: 'city', label: 'City', type: 'text' as const, required: true, placeholder: 'New York' },
          { id: 'postalCode', label: 'Postal Code', type: 'text' as const, required: true, placeholder: '10001' },
          { id: 'telephone', label: 'Phone Number', type: 'tel' as const, placeholder: '+1-555-555-5555' },
          { id: 'openingHours', label: 'Opening Hours', type: 'text' as const, placeholder: 'Mo-Fr 09:00-17:00' },
          { id: 'priceRange', label: 'Price Range', type: 'text' as const, placeholder: '$, $$, or $$$' },
        ];
      case SchemaType.ARTICLE:
        return [
          ...common,
          { id: 'headline', label: 'Headline', type: 'text' as const, required: true, placeholder: 'Enter article title' },
          { id: 'author', label: 'Author Name', type: 'text' as const, placeholder: 'John Doe' },
          { id: 'datePublished', label: 'Date Published', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
          { id: 'image', label: 'Main Image URL', type: 'url' as const, placeholder: 'https://example.com/image.jpg' },
        ];
      case SchemaType.PRODUCT:
        return [
          ...common,
          { id: 'sku', label: 'SKU / Model', type: 'text' as const, placeholder: 'PROD-123' },
          { id: 'brand', label: 'Brand', type: 'text' as const, placeholder: 'Brand Name' },
          { id: 'price', label: 'Price', type: 'text' as const, placeholder: '19.99' },
          { id: 'currency', label: 'Currency', type: 'text' as const, placeholder: 'USD' },
          { id: 'availability', label: 'Availability', type: 'text' as const, placeholder: 'InStock / OutOfStock' },
        ];
      case SchemaType.WEB_PAGE:
      default:
        return [
          ...common,
          { id: 'breadcrumb', label: 'Breadcrumb Path', type: 'text' as const, placeholder: 'Home > Services > Web Design' },
        ];
    }
  };

  const questions = getQuestions(type);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, responses });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-xl font-bold text-slate-800">Details for {type}</h3>
        <p className="text-sm text-slate-500 mt-1">Answer the questions below to help the AI craft your code.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {questions.map((q) => (
          <div key={q.id} className={q.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label htmlFor={q.id} className="block text-sm font-semibold text-slate-700 mb-2">
              {q.label} {q.required && <span className="text-red-500">*</span>}
            </label>
            {q.type === 'textarea' ? (
              <textarea
                id={q.id}
                required={q.required}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                placeholder={q.placeholder}
                rows={3}
                value={responses[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            ) : (
              <input
                id={q.id}
                type={q.type}
                required={q.required}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                placeholder={q.placeholder}
                value={responses[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Schema'
          )}
        </button>
      </div>
    </form>
  );
};
