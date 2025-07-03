import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CallLogListView, CallLogDetailView, CallLogStatus } from '../CallLogModel';
import CallLogService from '../CallLogService';
import InternalNotesService, { InternalNoteListView } from '../InternalNotesService';
import { useCallLogEnums } from '../../../@zenidata/hooks/useEnumTranslation';
import './CallDetailsDrawer.css';

interface CallDetailsDrawerProps {
  isOpen: boolean;
  callLog: CallLogListView | null;
  onClose: () => void;
  onCallLogUpdated?: (updatedCallLog: CallLogDetailView) => void;
}

interface StatusBadgeProps {
  status: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface TabContentProps {
  activeTab: string;
  callLog: CallLogDetailView;
  notes: InternalNoteListView[];
  loadingNotes: boolean;
  onAddNote: (content: string) => Promise<void>;
}

interface AddingNoteState {
  content: string;
  id: string;
}

interface DrawerHeaderProps {
  callLog: CallLogListView | CallLogDetailView;
  onClose: () => void;
}

interface DrawerFooterProps {
  callLog: CallLogDetailView;
  onSave: (status: CallLogStatus) => Promise<void>;
  saving: boolean;
}

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

// Toast Notification Component
const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-hide after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast-notification toast-${type}`}>
      <div className="toast-content">
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
        <span className="toast-message">{message}</span>
        <button onClick={onClose} className="toast-close">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

// Professional skeleton loading component
const DrawerSkeleton: React.FC = () => (
  <div className="drawer-skeleton">
    <div className="skeleton-section">
      <div className="skeleton-title"></div>
      <div className="skeleton-fields">
        <div className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-value long"></div>
        </div>
      </div>
    </div>
    
    <div className="skeleton-divider"></div>
    
    <div className="skeleton-section">
      <div className="skeleton-title"></div>
      <div className="skeleton-fields">
        <div className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-value medium"></div>
        </div>
        <div className="skeleton-field full">
          <div className="skeleton-label"></div>
          <div className="skeleton-text-block"></div>
        </div>
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'nouveau':
        return { label: 'Nouveau', className: 'status-new' };
      case 'in progress':
      case 'en cours':
        return { label: 'En Cours', className: 'status-in-progress' };
      case 'done':
      case 'terminé':
        return { label: 'Terminé', className: 'status-done' };
      default:
        return { label: 'Nouveau', className: 'status-new' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
};

// Drawer Header Component
const DrawerHeader: React.FC<DrawerHeaderProps> = ({ callLog, onClose }) => {
  const callerName = callLog.caller_first_name || callLog.caller_last_name
    ? `${callLog.caller_first_name || ''} ${callLog.caller_last_name || ''}`.trim()
    : 'Appelant inconnu';

  return (
    <div className="drawer-header">
      <div className="header-content">
        <h2 className="drawer-title">{callerName}</h2>
        <StatusBadge status={callLog.status || 'New'} />
      </div>
      <button 
        onClick={onClose} 
        className="drawer-close-btn"
        title="Fermer le dossier"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

// Tab Navigation Component
const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'details', label: 'Détails' },
    { id: 'notes', label: 'Notes & Gestion' },
    { id: 'transcription', label: 'Transcription & Audio' }
  ];

  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Tab Content Component
const TabContent: React.FC<TabContentProps> = ({ activeTab, callLog, notes, loadingNotes, onAddNote }) => {
  const { t } = useTranslation(['call-logs']);
  const { reason: translateReason } = useCallLogEnums();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState<AddingNoteState | null>(null);

  if (activeTab === 'details') {
    return (
      <div className="tab-content">
        {/* Section Appelant */}
        <div className="content-section">
          <h3 className="section-title">Appelant</h3>
          <div className="field-group">
            <div className="field">
              <label className="field-label">Prénom</label>
              <span className="field-value">{callLog.caller_first_name || 'Non renseigné'}</span>
            </div>
            <div className="field">
              <label className="field-label">Nom</label>
              <span className="field-value">{callLog.caller_last_name || 'Non renseigné'}</span>
            </div>
            <div className="field">
              <label className="field-label">Numéro de téléphone</label>
              <span className="field-value">
                <a href={`tel:${callLog.caller_phone_number}`} className="phone-link">
                  {callLog.caller_phone_number}
                </a>
              </span>
            </div>
            <div className="field">
              <label className="field-label">Type de Patient</label>
              <span className="field-value">
                {callLog.is_existing_patient === true ? 'Existant' : 
                 callLog.is_existing_patient === false ? 'Nouveau' : 'Non spécifié'}
              </span>
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        {/* Section Informations de l'Appel */}
        <div className="content-section">
          <h3 className="section-title">Informations de l'Appel</h3>
          <div className="field-group">
            <div className="field">
              <label className="field-label">Heure d'Appel</label>
              <span className="field-value">{new Date(callLog.call_started_at).toLocaleString()}</span>
            </div>
            <div className="field">
              <label className="field-label">Durée</label>
              <span className="field-value">
                {callLog.call_duration_seconds 
                  ? (() => {
                      const totalSeconds = Math.floor(callLog.call_duration_seconds);
                      const minutes = Math.floor(totalSeconds / 60);
                      const seconds = totalSeconds % 60;
                      return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
                    })()
                  : 'Non disponible'
                }
              </span>
            </div>
            <div className="field">
              <label className="field-label">Motif</label>
              <span className="field-value">
                {callLog.reason_for_call ? translateReason(callLog.reason_for_call) : 'Non spécifié'}
              </span>
            </div>
            <div className="field">
              <label className="field-label">Préférence d'appel</label>
              <span className="field-value">{callLog.callback_preference || 'Aucune préférence'}</span>
            </div>
            <div className="field">
              <label className="field-label">Dentiste préféré(e)</label>
              <span className="field-value">{callLog.preferred_dentist || 'Aucun dentiste spécifié'}</span>
            </div>
            <div className="field full-width">
              <label className="field-label">Résumé de l'appel</label>
              <div className="summary-content">
                {callLog.summary || 'Aucun résumé disponible'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'notes') {
    const handleAddNote = async () => {
      if (!newNoteContent.trim()) return;
      
      const noteContent = newNoteContent.trim();
      const tempId = `temp-${Date.now()}`;
      
      // Show adding animation immediately
      setAddingNote({ content: noteContent, id: tempId });
      setNewNoteContent('');
      
      try {
        await onAddNote(noteContent);
        // Clear adding state after success
        setAddingNote(null);
      } catch (error) {
        console.error('Failed to add note:', error);
        // Restore content and clear adding state on error
        setNewNoteContent(noteContent);
        setAddingNote(null);
      }
    };

    return (
      <div className="tab-content">
        {/* Section Ajouter une note */}
        <div className="content-section">
          <h3 className="section-title">Ajouter une note interne</h3>
          <div className="note-form">
            <textarea 
              className="note-textarea"
              placeholder="Écrire une note pour l'équipe..."
              rows={4}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            <button 
              className="add-note-btn"
              onClick={handleAddNote}
              disabled={!newNoteContent.trim() || !!addingNote}
            >
              <i className={`fas ${addingNote ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
              {addingNote ? 'Ajout en cours...' : 'Ajouter la note'}
            </button>
          </div>
        </div>

        <hr className="section-divider" />

        {/* Section Historique des notes */}
        <div className="content-section">
          <h3 className="section-title">Historique des notes</h3>
          <div className="notes-history">
            {/* Show adding note animation */}
            {addingNote && (
              <div key={addingNote.id} className="note-entry adding-note">
                <div className="note-text">{addingNote.content}</div>
                <div className="note-meta">
                  <i className="fas fa-spinner fa-spin"></i>
                  Ajout en cours...
                </div>
              </div>
            )}
            
            {loadingNotes ? (
              <div className="loading-notes">
                <i className="fas fa-spinner fa-spin"></i>
                Chargement des notes...
              </div>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="note-entry fade-in">
                  <div className="note-text">{note.content}</div>
                  <div className="note-meta">
                    Par {note.created_by 
                      ? `${note.created_by.first_name} ${note.created_by.last_name}` 
                      : 'Utilisateur inconnu'
                    } le {new Date(note.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-notes">Aucune note disponible pour cet appel.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'transcription') {
    return (
      <div className="tab-content">
        {/* Section Enregistrement audio */}
        <div className="content-section">
          <h3 className="section-title">Enregistrement audio</h3>
          {callLog.audio_recording_url ? (
            <div className="audio-player-container">
              <audio controls className="audio-player">
                <source src={callLog.audio_recording_url} type="audio/mpeg" />
                <source src={callLog.audio_recording_url} type="audio/wav" />
                Votre navigateur ne supporte pas l'élément audio.
              </audio>
            </div>
          ) : (
            <div className="no-audio">Aucun enregistrement audio disponible pour cet appel.</div>
          )}
        </div>

        <hr className="section-divider" />

        {/* Section Transcription */}
        <div className="content-section">
          <h3 className="section-title">Transcription de l'appel complet</h3>
          <div className="transcription-content">
            {callLog.transcript_text ? (
              <div className="transcription-text">
                {(() => {
                  // Split transcript by speaker lines and format with alternating backgrounds
                  const lines = callLog.transcript_text.split('\n').filter(line => line.trim());
                  return lines.map((line, index) => {
                    const isAI = line.toLowerCase().startsWith('ai:') || line.toLowerCase().startsWith('assistant:');
                    const isUser = line.toLowerCase().startsWith('user:') || line.toLowerCase().startsWith('caller:');
                    const isSystem = line.toLowerCase().startsWith('system:');
                    
                    let className = 'transcript-line';
                    if (isAI) className += ' transcript-ai';
                    else if (isUser) className += ' transcript-user';
                    else if (isSystem) className += ' transcript-system';
                    else className += ' transcript-neutral';
                    
                    return (
                      <div key={index} className={className}>
                        {line}
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <div className="no-transcription">Aucune transcription disponible pour cet appel.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Drawer Footer Component
const DrawerFooter: React.FC<DrawerFooterProps> = ({ callLog, onSave, saving }) => {
  const [status, setStatus] = useState<CallLogStatus>(callLog.status);

  // Sync status when callLog changes
  useEffect(() => {
    setStatus(callLog.status);
  }, [callLog.status]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as CallLogStatus);
  };

  const handleSave = async () => {
    try {
      await onSave(status);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  return (
    <div className="drawer-footer">
      {/* Ligne 1: Actions */}
      <div className="footer-actions">
        <div className="status-selector">
          <label htmlFor="status-select" className="status-label">Statut :</label>
          <select 
            id="status-select"
            value={status} 
            onChange={handleStatusChange}
            className="status-select"
          >
            <option value="New">Nouveau</option>
            <option value="In Progress">En Cours</option>
            <option value="Done">Terminé</option>
            <option value="Archived">Archivé</option>
          </select>
        </div>
        <button onClick={handleSave} className="save-btn" disabled={saving}>
          <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
      
      {/* Ligne 2: Métadonnées condensées */}
      <div className="footer-metadata-compact">
        Créé le {new Date(callLog.created_at).toLocaleDateString()} • 
        Modifié: {callLog.updated_at ? new Date(callLog.updated_at).toLocaleDateString() : 'Jamais'} • 
        ID: {callLog.external_call_id.substring(0, 8)}...{callLog.external_call_id.substring(callLog.external_call_id.length - 6)}
      </div>
    </div>
  );
};

// Main CallDetailsDrawer Component
export const CallDetailsDrawer: React.FC<CallDetailsDrawerProps> = ({ 
  isOpen, 
  callLog, 
  onClose, 
  onCallLogUpdated 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [detailedCallLog, setDetailedCallLog] = useState<CallLogDetailView | null>(null);
  const [notes, setNotes] = useState<InternalNoteListView[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Fetch detailed call log data
  const fetchCallLogDetails = useCallback(async (callLogId: string) => {
    try {
      setLoading(true);
      const details = await CallLogService.getCallLogById(callLogId);
      setDetailedCallLog(details);
    } catch (error) {
      console.error('Failed to fetch call log details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notes for the call log
  const fetchNotes = useCallback(async (callLogId: string) => {
    try {
      setLoadingNotes(true);
      const notePage = await InternalNotesService.getNotesForCallLog(callLogId);
      setNotes(notePage.items);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }, []);

  // Add new note
  const handleAddNote = useCallback(async (content: string) => {
    if (!detailedCallLog) return;
    
    try {
      const newNote = await InternalNotesService.createNote({
        content,
        call_log_id: detailedCallLog.id
      });
      
      // Refresh notes list
      await fetchNotes(detailedCallLog.id);
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  }, [detailedCallLog, fetchNotes]);

  // Save call log changes
  const handleSave = useCallback(async (status: CallLogStatus) => {
    if (!detailedCallLog) return;
    
    try {
      setSaving(true);
      const updatedCallLog = await CallLogService.updateCallLog(detailedCallLog.id, { status });
      console.log('💾 CallDetailsDrawer: Call log updated successfully:', { 
        id: updatedCallLog.id, 
        status: updatedCallLog.status 
      });
      setDetailedCallLog(updatedCallLog);
      
      console.log('📞 CallDetailsDrawer: Calling onCallLogUpdated callback');
      onCallLogUpdated?.(updatedCallLog);
      
      // Show success toast
      setToast({
        message: '✅ Modifications enregistrées avec succès',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to save call log:', error);
      
      // Show error toast
      setToast({
        message: '❌ Erreur lors de l\'enregistrement',
        type: 'error'
      });
      
      throw error;
    } finally {
      setSaving(false);
    }
  }, [detailedCallLog, onCallLogUpdated]);

  // Load data when call log changes
  useEffect(() => {
    if (isOpen && callLog) {
      fetchCallLogDetails(callLog.id);
      fetchNotes(callLog.id);
    }
  }, [isOpen, callLog, fetchCallLogDetails, fetchNotes]);

  // Close drawer when clicking on backdrop
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Close toast notification
  const handleCloseToast = useCallback(() => {
    setToast(null);
  }, []);

  // Reset to details tab when opening
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab('details');
    }
  }, [isOpen]);

  if (!isOpen || !callLog) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="call-details-backdrop" onClick={handleBackdropClick}></div>
      
      {/* Drawer */}
      <div className={`call-details-drawer ${isOpen ? 'open' : ''}`}>
        <DrawerHeader callLog={detailedCallLog || callLog} onClose={onClose} />
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="drawer-content">
          {loading || !detailedCallLog ? (
            <DrawerSkeleton />
          ) : (
            <TabContent 
              activeTab={activeTab} 
              callLog={detailedCallLog}
              notes={notes}
              loadingNotes={loadingNotes}
              onAddNote={handleAddNote}
            />
          )}
        </div>
        {detailedCallLog && (
          <DrawerFooter 
            callLog={detailedCallLog} 
            onSave={handleSave}
            saving={saving}
          />
        )}
        
        {/* Toast Notification */}
        <ToastNotification
          message={toast?.message || ''}
          type={toast?.type || 'success'}
          isVisible={!!toast}
          onClose={handleCloseToast}
        />
      </div>
    </>
  );
};

export default CallDetailsDrawer;