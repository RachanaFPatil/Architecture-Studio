import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Form & Frame` : 'Form & Frame | Architecture Studio';
  }, [title]);
}
