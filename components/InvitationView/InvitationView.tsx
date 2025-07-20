'use client';

import React from 'react';
import type { Invitation } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateEvent, updateInvitationInState } from '@/lib/features/currentEvent/currentEventSlice';
import { useTranslations } from 'next-intl';
import './InvitationView.css';

// This is a simplified version for demonstration.
// The complex drag-and-drop and scaling logic from the original would be adapted here,
// but now all `setInvitation` calls would become `dispatch(updateInvitationInState(...))`.

const InvitationView = () => {
    const t = useTranslations('Invitation');
    const dispatch = useAppDispatch();
    const { event, loading } = useAppSelector(state => state.currentEvent);

    const handleInvitationChange = (newInvitationData: Partial<Invitation>) => {
        if(event?.invitation) {
            const updatedInvitation = { ...event.invitation, ...newInvitationData };
            dispatch(updateInvitationInState(updatedInvitation as Invitation));
        }
    };

    const handleSave = () => {
        if (event) {
            dispatch(updateEvent(event));
        }
    };
    
    if (!event) {
        return <div>Loading invitation...</div>;
    }
    
    const { invitation } = event;

    return (
        <div>
            <div className="main-header">
                <h2>{t('title')}</h2>
                <p>{t('subtitle')}</p>
            </div>
            <div className="card">
                <h3 className="card-title mb-4">{t('settingsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="form-group">
                        <label htmlFor="headline">{t('editTitle', {elementId: 'Headline'})}</label>
                        <input id="headline" type="text" className="form-input" 
                               value={invitation.headline} 
                               onChange={e => handleInvitationChange({ headline: e.target.value })} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="body_text">{t('editTitle', {elementId: 'Body'})}</label>
                        <textarea id="body_text" className="form-textarea"
                                  value={invitation.body_text} 
                                  onChange={e => handleInvitationChange({ body_text: e.target.value })}
                        />
                    </div>
                     <div className="form-group">
                        <label htmlFor="bg_image">{t('bgImageLabel')}</label>
                        <input id="bg_image" type="text" className="form-input" 
                               value={invitation.bg_image_url || ''} 
                               onChange={e => handleInvitationChange({ bg_image_url: e.target.value })} 
                        />
                    </div>
                     <div className="form-group">
                        <label htmlFor="rsvp_info">{t('editTitle', {elementId: 'RSVP Info'})}</label>
                        <input id="rsvp_info" type="text" className="form-input" 
                               value={invitation.rsvp_info} 
                               onChange={e => handleInvitationChange({ rsvp_info: e.target.value })} 
                        />
                    </div>
                </div>
                 <div className="flex justify-end mt-4">
                    <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="spinner"></span> : null}
                        {loading ? t('saving') : t('saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitationView;
