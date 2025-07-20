'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const SuppliersView = () => {
    const t = useTranslations('Suppliers');
    return (
        <div>
            <div className="main-header">
                <h2>{t('title')}</h2>
                <p>{t('subtitle')}</p>
            </div>
            <div className="card">
               <div className="p-6 text-center text-text-muted">
                    <p>{t('comingSoon')}</p>
               </div>
            </div>
        </div>
    );
};

export default SuppliersView;
