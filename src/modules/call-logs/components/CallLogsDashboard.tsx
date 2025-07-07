/**
 * CallLogsDashboard Component
 * 
 * A comprehensive dashboard for viewing and managing all call logs.
 * Features:
 * - Displays all calls regardless of status (formerly only showed new calls)
 * - Status-based color coding for visual workflow management
 * - Filtering and search capabilities
 * - Pagination support
 * - Real-time status updates via drawer interface
 * 
 * Color Coding:
 * - Blue: NEW calls requiring attention
 * - Orange: IN_PROGRESS calls being worked on  
 * - Green: DONE calls completed
 * - Gray: ARCHIVED calls stored for reference
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useClinic } from '../../clinics/hooks/useClinic';
import CallLogService from '../CallLogService';
import { CallLogListView, CallLogDetailView } from '../CallLogModel';
import { LoadingScreen } from '../../../@zenidata/components/UI/Loader';
import { formatDateAsLocaleString } from '../../../@zenidata/utils';
import { useDebounce } from '../../../@zenidata/hooks/useDebounce';
import CallLogSummary from './CallLogSummary';
import { CallDetailsDrawer } from './CallDetailsDrawer';
import { useCallLogEnums } from '../../../@zenidata/hooks/useEnumTranslation';
import './CallLogsDashboard.css';

interface CallLogsDashboardProps {
  maxItems?: number;
  refreshInterval?: number;
  showFilters?: boolean;
}

interface Filters {
  lastName: string;
  firstName: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// Skeleton loader component
const CallLogSkeleton: React.FC = () => (
  <div className="call-log-skeleton">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="skeleton-row">
        <div className="skeleton-cell skeleton-name"></div>
        <div className="skeleton-cell skeleton-phone"></div>
        <div className="skeleton-cell skeleton-date"></div>
        <div className="skeleton-cell skeleton-reason"></div>
        <div className="skeleton-cell skeleton-summary"></div>
        <div className="skeleton-cell skeleton-action"></div>
      </div>
    ))}
  </div>
);


export const CallLogsDashboard: React.FC<CallLogsDashboardProps> = ({
  maxItems = 50,
  showFilters = true
}) => {
  const { t } = useTranslation(['call-logs', 'core']);
  const { selectedClinic } = useClinic();
  const { reason: translateReason } = useCallLogEnums();
  
  // State management
  const [callLogs, setCallLogs] = useState<CallLogListView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLogListView | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    lastName: '',
    firstName: '',
    phoneNumber: '',
    startDate: '',
    endDate: ''
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0
  });

  // Debounced filter values to avoid excessive API calls
  const debouncedLastName = useDebounce(filters.lastName, 500);
  const debouncedFirstName = useDebounce(filters.firstName, 500);
  const debouncedPhoneNumber = useDebounce(filters.phoneNumber, 500);

  // Check if we need to use advanced search (when filters are applied)
  const hasActiveFilters = useMemo(() => {
    return debouncedLastName || debouncedFirstName || debouncedPhoneNumber || filters.startDate || filters.endDate;
  }, [debouncedLastName, debouncedFirstName, debouncedPhoneNumber, filters.startDate, filters.endDate]);

  // Fetch function for all calls
  const fetchAllCalls = useCallback(async (page: number, limit: number) => {
    if (!selectedClinic?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await CallLogService.getCallLogsByClinic(
        selectedClinic.id,
        { page, limit }
      );
      
      setCallLogs(result.items);
      setPagination({
        totalItems: result.total,
        totalPages: result.pages,
        currentPage: result.page,
        itemsPerPage: result.limit,
      });
      setLastFetchTime(new Date());
    } catch (err) {
      setError(t('call-logs:errors.fetchFailed'));
      console.error('Error fetching call logs:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedClinic?.id, t]);

  // Fetch function for filtered search (advanced endpoint)
  const fetchFilteredCalls = useCallback(async () => {
    if (!selectedClinic?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const searchOptions = {
        caller_last_name: debouncedLastName || undefined,
        caller_first_name: debouncedFirstName || undefined,
        caller_phone_number: debouncedPhoneNumber || undefined,
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };

      const result = await CallLogService.searchCallLogs(selectedClinic.id, searchOptions);
      
      setCallLogs(result.items);
      setPagination({
        totalItems: result.total,
        totalPages: result.pages,
        currentPage: result.page,
        itemsPerPage: result.limit,
      });
      setLastFetchTime(new Date());
    } catch (err) {
      setError(t('call-logs:errors.searchFailed'));
      console.error('Error searching calls:', err);
    } finally {
      setLoading(false);
    }
  }, [
    selectedClinic?.id,
    debouncedLastName,
    debouncedFirstName,
    debouncedPhoneNumber,
    filters.startDate,
    filters.endDate,
    pagination.currentPage,
    pagination.itemsPerPage,
    t
  ]);

  // Main fetch effect - chooses optimal endpoint based on filters (all calls vs filtered search)
  useEffect(() => {
    if (hasActiveFilters) {
      fetchFilteredCalls();
    } else {
      fetchAllCalls(pagination.currentPage, pagination.itemsPerPage);
    }
  }, [hasActiveFilters, fetchAllCalls, fetchFilteredCalls, pagination.currentPage, pagination.itemsPerPage]);

  const handleRefresh = () => {
    if (hasActiveFilters) {
      fetchFilteredCalls();
    } else {
      fetchAllCalls(pagination.currentPage, pagination.itemsPerPage);
    }
  };

  // Filter change handlers
  const handleFilterChange = useCallback((field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    }));
  }, []);

  const togglePlayPause = useCallback((callLogId: string, audioUrl: string) => {
    if (audioRef.current) {
      if (playingAudioId === callLogId) {
        // If the same audio is playing, pause it
        audioRef.current.pause();
        setPlayingAudioId(null);
      } else {
        // If a different audio is playing or no audio is playing, stop current and play new
        audioRef.current.pause();
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAudioId(callLogId);
      }
    } else {
      // If audioRef is null (first time playing)
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingAudioId(callLogId);
    }
  }, [playingAudioId]);

  // Listen for audio ending to reset state
  useEffect(() => {
    if (audioRef.current) {
      const onEnded = () => setPlayingAudioId(null);
      audioRef.current.addEventListener('ended', onEnded);
      return () => {
        audioRef.current?.removeEventListener('ended', onEnded);
      };
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      lastName: '',
      firstName: '',
      phoneNumber: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Clear individual filter field
  const clearFilterField = useCallback((field: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [field]: ''
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Calculate dynamic summary length based on screen width
  const getSummaryLength = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1400) return 150; // Large screens
    if (screenWidth >= 1200) return 100; // Medium-large screens  
    if (screenWidth >= 992) return 80;   // Medium screens
    if (screenWidth >= 768) return 60;   // Small-medium screens
    return 40; // Small screens
  }, []);

  const [summaryLength, setSummaryLength] = useState(getSummaryLength());

  // Update summary length on window resize
  useEffect(() => {
    const handleResize = () => {
      setSummaryLength(getSummaryLength());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSummaryLength]);

  // Drawer handlers
  const openDrawer = useCallback((callLog: CallLogListView) => {
    setSelectedCallLog(callLog);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedCallLog(null);
  }, []);

  // Handle call log update from drawer
  const handleCallLogUpdated = useCallback((updatedCallLog: CallLogDetailView) => {
    console.log('🔄 handleCallLogUpdated called - triggering table refresh');
    
    // Trigger the same refresh logic as the "Appliquer" button
    handleRefresh();
    
    // Update selected call log if it's the same one  
    if (selectedCallLog?.id === updatedCallLog.id) {
      console.log('🎯 Updating selected call log');
      setSelectedCallLog(prev => prev ? { 
        ...prev, 
        status: updatedCallLog.status,
        caller_first_name: updatedCallLog.caller_first_name,
        caller_last_name: updatedCallLog.caller_last_name,
        reason_for_call: updatedCallLog.reason_for_call,
        summary: updatedCallLog.summary
      } : null);
    }
  }, [selectedCallLog, handleRefresh]);

  // Paginated data for display
  const paginatedCallLogs = useMemo(() => {
    // Both filtered and new calls use server-side pagination
    // The API handles pagination and returns the correct page of results
    return callLogs;
  }, [callLogs]);

  // No clinic selected state
  if (!selectedClinic) {
    return (
      <div className="call-logs-dashboard">
        <div className="dashboard-error">
          <div className="error-content">
            <i className="fas fa-clinic-medical"></i>
            <h3>{t('call-logs:dashboard.noClinicSelected')}</h3>
            <p>{t('call-logs:dashboard.selectClinicMessage')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="call-logs-dashboard">


      {/* Two-Line Filter System */}
      {showFilters && (
        <div className="two-line-filter-system">
          {/* Line 1: Specific Search Fields */}
          <div className="filter-line-1">
            <div className="search-fields-row">
              <div className="search-field-container">
                <input
                  id="lastName"
                  type="text"
                  value={filters.lastName}
                  onChange={(e) => handleFilterChange('lastName', e.target.value)}
                  placeholder="Rechercher par nom..."
                  className="search-field"
                />
                {filters.lastName && (
                  <button
                    type="button"
                    onClick={() => clearFilterField('lastName')}
                    className="clear-field-btn"
                    title="Effacer le nom"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <div className="search-field-container">
                <input
                  id="firstName"
                  type="text"
                  value={filters.firstName}
                  onChange={(e) => handleFilterChange('firstName', e.target.value)}
                  placeholder="Rechercher par prénom..."
                  className="search-field"
                />
                {filters.firstName && (
                  <button
                    type="button"
                    onClick={() => clearFilterField('firstName')}
                    className="clear-field-btn"
                    title="Effacer le prénom"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <div className="search-field-container">
                <input
                  id="phoneNumber"
                  type="text"
                  value={filters.phoneNumber}
                  onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                  placeholder="Rechercher par téléphone..."
                  className="search-field"
                />
                {filters.phoneNumber && (
                  <button
                    type="button"
                    onClick={() => clearFilterField('phoneNumber')}
                    className="clear-field-btn"
                    title="Effacer le téléphone"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Line 2: Pagination Info, Dates and Actions */}
          <div className="filter-line-2">
            <div className="left-group">
              <div className="items-per-page">
                <label htmlFor="itemsPerPage">Éléments par page:</label>
                <select
                  id="itemsPerPage"
                  value={pagination.itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="items-per-page-select"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              {pagination.totalItems > 0 && (
                <div className="pagination-info">
                  Affichage de {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)} à {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} sur {pagination.totalItems} entrées
                </div>
              )}
            </div>

            <div className="right-group">
              <div className="date-filters-group">
                <div className="search-field-container">
                  <input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="date-filter-input"
                    title="Date de début"
                  />
                  {filters.startDate && (
                    <button
                      type="button"
                      onClick={() => clearFilterField('startDate')}
                      className="clear-field-btn clear-date-btn"
                      title="Effacer la date de début"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                <span className="date-separator">—</span>
                <div className="search-field-container">
                  <input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="date-filter-input"
                    title="Date de fin"
                  />
                  {filters.endDate && (
                    <button
                      type="button"
                      onClick={() => clearFilterField('endDate')}
                      className="clear-field-btn clear-date-btn"
                      title="Effacer la date de fin"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="action-buttons">
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="secondary-btn">
                    Effacer
                  </button>
                )}
                <button onClick={handleRefresh} className="primary-btn" disabled={loading}>
                  {loading ? 'Actualisation...' : 'Appliquer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Call Logs Table */}
      <div className="call-logs-container">
        {loading ? (
          <CallLogSkeleton />
        ) : error ? (
          <div className="error-state">
            <div className="error-content">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>{t('call-logs:errors.loadError')}</h3>
              <p>{error}</p>
              <button onClick={hasActiveFilters ? fetchFilteredCalls : () => fetchAllCalls(pagination.currentPage, pagination.itemsPerPage)} className="retry-btn">
                <i className="fas fa-retry"></i>
                {t('core:common.retry')}
              </button>
            </div>
          </div>
        ) : paginatedCallLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <i className="fas fa-phone-slash"></i>
              <h3>
                {hasActiveFilters 
                  ? t('call-logs:dashboard.noFilteredResults')
                  : t('call-logs:dashboard.noNewCalls')
                }
              </h3>
              <p>
                {hasActiveFilters 
                  ? t('call-logs:dashboard.tryDifferentFilters')
                  : t('call-logs:dashboard.checkBackLater')
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="call-logs-table">
            <table>
              <thead>
                <tr>
                  <th>{t('call-logs:table.callerName')}</th>
                  <th>{t('call-logs:table.phoneNumber')}</th>
                  <th>{t('call-logs:table.callTime')}</th>
                  <th>{t('call-logs:table.reason')}</th>
                  <th>{t('call-logs:table.summary')}</th>
                  <th>{t('call-logs:table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCallLogs.map((callLog) => {
                  // Get status-based CSS class
                  const statusClass = `status-${callLog.status.toLowerCase().replace('_', '-')}`;
                  // Check if this row is currently selected in the drawer
                  const isSelected = selectedCallLog?.id === callLog.id && isDrawerOpen;
                  
                  return (
                  <tr key={callLog.id} className={`call-log-row ${statusClass} ${isSelected ? 'selected' : ''}`}>
                    <td className="caller-name">
                      {callLog.caller_first_name || callLog.caller_last_name
                        ? `${callLog.caller_first_name || ''} ${callLog.caller_last_name || ''}`.trim()
                        : <span className="unknown-caller">Appelant inconnu</span>
                      }
                    </td>
                    <td className="phone-number">
                      <a href={`tel:${callLog.caller_phone_number}`} className="phone-link">
                        {callLog.caller_phone_number}
                      </a>
                    </td>
                    <td className="call-time">
                      {formatDateAsLocaleString(callLog.call_started_at)}
                    </td>
                    <td className="reason">
                      {callLog.reason_for_call ? 
                        translateReason(callLog.reason_for_call) : 
                        <span className="unknown-info">Non spécifié</span>
                      }
                    </td>
                    <td className="summary">
                      {callLog.summary ? (
                        <span 
                          className="summary-text" 
                          data-tooltip={callLog.summary}
                        >
                          {callLog.summary.length > summaryLength 
                            ? `${callLog.summary.substring(0, summaryLength)}...` 
                            : callLog.summary
                          }
                        </span>
                      ) : (
                        <span className="unknown-info">Aucun résumé</span>
                      )}
                    </td>
                    <td className="actions">
                      <div className="actions-container">
                        {callLog.audio_recording_url && (
                          <button
                            onClick={() => togglePlayPause(callLog.id, callLog.audio_recording_url!)}
                            className="action-icon-btn audio-btn"
                            title={playingAudioId === callLog.id ? t('call-logs:actions.pauseAudio') : t('call-logs:actions.playAudio')}
                          >
                            <i className={`fas ${playingAudioId === callLog.id ? 'fa-pause' : 'fa-play'}`}></i>
                          </button>
                        )}
                        <button
                          onClick={() => openDrawer(callLog)}
                          className="action-icon-btn view-btn"
                          title={t('call-logs:actions.viewDetails')}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Navigation */}
      {pagination.totalPages > 1 && !loading && (
        <div className="pagination-navigation">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-left"></i>
            {t('call-logs:pagination.previous')}
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
              // Calculate page numbers around current page
              let startPage = Math.max(1, pagination.currentPage - 2);
              let endPage = Math.min(pagination.totalPages, startPage + 4);
              
              // Adjust start if we're near the end
              if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
              }
              
              const pageNumber = startPage + index;
              
              if (pageNumber > endPage || pageNumber > pagination.totalPages) return null;
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`page-number ${pageNumber === pagination.currentPage ? 'active' : ''}`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="pagination-btn"
          >
            {t('call-logs:pagination.next')}
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Call Log Details Drawer */}
      <CallDetailsDrawer 
        isOpen={isDrawerOpen}
        callLog={selectedCallLog}
        onClose={closeDrawer}
        onCallLogUpdated={handleCallLogUpdated}
      />
    </div>
  );
};

export default CallLogsDashboard;