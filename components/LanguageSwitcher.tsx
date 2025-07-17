// components/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const locales = ['en', 'he'];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (nextLocale: string) => {
    // More robust path handling
    const segments = pathname.split('/').filter(Boolean);
    
    // Check if first segment is a locale
    const currentLocaleInPath = segments[0];
    const isCurrentSegmentLocale = locales.includes(currentLocaleInPath);
    
    let pathWithoutLocale = '';
    
    if (isCurrentSegmentLocale) {
      // Remove the locale from path
      pathWithoutLocale = segments.slice(1).join('/');
    } else {
      // No locale in path, use full path
      pathWithoutLocale = segments.join('/');
    }
    
    // Build new path
    const newPath = `/${nextLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
    
    // Use router.push instead of window.location.href for better navigation
    router.push(newPath);
  };

  return (
    <div className='flex gap-2 mb-4'>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200 ${
            locale === loc 
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
      
      {/* Debug info - remove in production */}
      <div className="text-xs text-gray-500 ml-4">
        Current locale: {locale} | Path: {pathname}
      </div>
    </div>
  );
}