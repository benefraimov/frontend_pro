// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
// import { notFound } from 'next/navigation';

export const locales = ['en', 'he'];
export const defaultLocale = 'he';

export default getRequestConfig(async ({ locale }) => {
  
    // if (!locales.includes(locale as any)) notFound();
  
  // Validate that the incoming locale is valid and ensure it's a string
  const validLocale = locale && routing.locales.includes(locale as any) 
    ? locale 
    : routing.defaultLocale;

  console.log(`Loading messages for locale: ${validLocale}`);

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});