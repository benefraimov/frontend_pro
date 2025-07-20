'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { hydrateAuth } from '@/lib/features/auth/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const hydrated = useRef(false);

    useEffect(() => {
        // Prevent re-hydrating on re-renders
        if (!hydrated.current) {
            dispatch(hydrateAuth());
            hydrated.current = true;
        }
    }, [dispatch]);

    return <>{children}</>;
}
