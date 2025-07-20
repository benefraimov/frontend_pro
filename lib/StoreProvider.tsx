'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { injectStore } from './api';
import AuthProvider from '@/components/AuthProvider';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<AppStore | null>(null);
	if (!storeRef.current) {
		storeRef.current = makeStore();
		injectStore(storeRef.current); // Inject store into API client
	}

	return (
		<Provider store={storeRef.current}>
			<AuthProvider>{children}</AuthProvider>
		</Provider>
	);
}
