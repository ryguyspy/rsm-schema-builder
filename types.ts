
export enum SchemaType {
  LOCAL_BUSINESS = 'Local Business',
  WEB_PAGE = 'Web Page',
  ARTICLE = 'Article',
  PRODUCT = 'Product'
}

export interface Question {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email' | 'tel';
  placeholder?: string;
  description?: string;
  required?: boolean;
}

export interface SchemaFormData {
  type: SchemaType;
  responses: Record<string, string>;
}

export interface GeneratedSchema {
  jsonLd: string;
  explanation: string;
}
