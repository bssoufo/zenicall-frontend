import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useClinic } from '../../clinics/hooks/useClinic';
import CallLogService from '../CallLogService';
import { CallLogListView } from '../CallLogModel';
import { LoadingScreen } from '../../../@zenidata/components/UI/Loader';
import { useDebounce } from '../../../@zenidata/hooks/useDebounce';
import CallLogSummary from './CallLogSummary';
import './NewCallLogsDashboard.css';

interface NewCallLogsDashboardProps {
  maxItems?: number;
  refreshInterval?: number;
  showFilters?: boolean;
}

interface Filters {
  firstName: string;
  lastName: string;
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
        <div className="skeleton-cell skeleton-id"></div>
        <div className="skeleton-cell skeleton-name"></div>
        <div className="skeleton-cell skeleton-phone"></div>
        <div className="skeleton-cell skeleton-date"></div>
        <div className="skeleton-cell skeleton-reason"></div>
        <div className="skeleton-cell skeleton-action"></div>
      </div>
    ))}
  </div>
);

export const NewCallLogsDashboard: React.FC<NewCallLogsDashboardProps> = ({
  maxItems = 50,
  showFilters = true
}) => {
  const { t } = useTranslation(['call-logs', 'core']);
  const { selectedClinic } = useClinic();
  
  // State management
  const [callLogs, setCallLogs] = useState<CallLogListView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    firstName: '',
    lastName: '',
    startDate: '',
    endDate: ''
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  // Debounced filter values to avoid excessive API calls
  const debouncedFirstName = useDebounce(filters.firstName, 500);
  const debouncedLastName = useDebounce(filters.lastName, 500);

  // Check if we need to use advanced search (when filters are applied)
  const hasActiveFilters = useMemo(() => {
    return debouncedFirstName || debouncedLastName || filters.startDate || filters.endDate;
  }, [debouncedFirstName, debouncedLastName, filters.startDate, filters.endDate]);

  // Fetch function for new calls (optimized endpoint)
  const fetchNewCalls = useCallback(async (page: number, limit: number) => {
    if (!selectedClinic?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await CallLogService.getNewCallLogs(
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
      console.error('Error fetching new calls:', err);
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
        caller_first_name: debouncedFirstName || undefined,
        caller_last_name: debouncedLastName || undefined,
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
    debouncedFirstName,
    debouncedLastName,
    filters.startDate,
    filters.endDate,
    pagination.currentPage,
    pagination.itemsPerPage,
    t
  ]);

  // Main fetch effect - chooses optimal endpoint based on filters
  useEffect(() => {
    if (hasActiveFilters) {
      fetchFilteredCalls();
    } else {
      fetchNewCalls(pagination.currentPage, pagination.itemsPerPage);
    }
  }, [hasActiveFilters, fetchNewCalls, fetchFilteredCalls, pagination.currentPage, pagination.itemsPerPage]);

  const handleRefresh = () => {
    if (hasActiveFilters) {
      fetchFilteredCalls();
    } else {
      fetchNewCalls(pagination.currentPage, pagination.itemsPerPage);
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
      firstName: '',
      lastName: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Paginated data for display
  const paginatedCallLogs = useMemo(() => {
    // Both filtered and new calls use server-side pagination
    // The API handles pagination and returns the correct page of results
    return callLogs;
  }, [callLogs]);

  // No clinic selected state
  if (!selectedClinic) {
    return (
      <div className="new-calls-dashboard">
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
    <div className="new-calls-dashboard">


      {/* Compact Filters Section */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="firstName">{t('call-logs:filters.firstName')}</label>
              <input
                id="firstName"
                type="text"
                value={filters.firstName}
                onChange={(e) => handleFilterChange('firstName', e.target.value)}
                placeholder={t('call-logs:filters.firstNamePlaceholder')}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="lastName">{t('call-logs:filters.lastName')}</label>
              <input
                id="lastName"
                type="text"
                value={filters.lastName}
                onChange={(e) => handleFilterChange('lastName', e.target.value)}
                placeholder={t('call-logs:filters.lastNamePlaceholder')}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="startDate">{t('call-logs:filters.startDate')}</label>
              <input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="endDate">{t('call-logs:filters.endDate')}</label>
              <input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="filter-input"
              />
            </div>
            
            <div className="filter-actions">
              <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-sync-alt fa-spin"></i>
                    {t('core:common.refreshing')}
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt"></i>
                    {t('core:common.refresh')}
                  </>
                )}
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  <i className="fas fa-times"></i>
                  {t('call-logs:filters.clearAll')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">{t('call-logs:pagination.itemsPerPage')}</label>
          <select
            id="itemsPerPage"
            value={pagination.itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="items-per-page-select"
          >
            <option value={10}>{t('call-logs:pagination.items_10')}</option>
            <option value={20}>{t('call-logs:pagination.items_20')}</option>
            <option value={50}>{t('call-logs:pagination.items_50')}</option>
          </select>
        </div>
        
        {pagination.totalItems > 0 && (
          <div className="pagination-info">
            {t('call-logs:pagination.showing', {
              start: Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems),
              end: Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems),
              total: pagination.totalItems
            })}
          </div>
        )}

        <div className="header-meta" style={{marginLeft: "auto"}}>
          {lastFetchTime && (
            <span className="last-updated">
              {t('call-logs:dashboard.lastUpdated')}: {lastFetchTime.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

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
              <button onClick={hasActiveFilters ? fetchFilteredCalls : () => fetchNewCalls(pagination.currentPage, pagination.itemsPerPage)} className="retry-btn">
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
                  // Check if call is recent (within last hour) to mark as "new"
                  const isNewCall = new Date(callLog.call_started_at) > new Date(Date.now() - 60 * 60 * 1000);
                  
                  return (
                  <tr key={callLog.id} className={`call-log-row ${isNewCall ? 'new-call' : ''}`}>
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
                      {new Date(callLog.call_started_at).toLocaleString()}
                    </td>
                    <td className="reason">
                      {callLog.reason_for_call || <span className="unknown-info">Non spécifié</span>}
                    </td>
                    <td className="summary">
                      {callLog.summary ? (
                        <span 
                          className="summary-text" 
                          title={callLog.summary}
                          data-tooltip={callLog.summary}
                        >
                          {callLog.summary.length > 50 
                            ? `${callLog.summary.substring(0, 50)}...` 
                            : callLog.summary
                          }
                        </span>
                      ) : (
                        <span className="unknown-info">Aucun résumé</span>
                      )}
                    </td>
                    <td className="actions">
                      {callLog.audio_recording_url && (
                        <button
                          onClick={() => togglePlayPause(callLog.id, callLog.audio_recording_url!)}
                          className="audio-play-btn"
                          title={playingAudioId === callLog.id ? t('call-logs:actions.pauseAudio') : t('call-logs:actions.playAudio')}
                        >
                          <i className={`fas ${playingAudioId === callLog.id ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                      )}
                      <Link 
                        to={`/clinics/${selectedClinic.id}/call-logs/${callLog.id}`}
                        className="view-btn"
                        title={t('call-logs:actions.viewDetails')}
                      >
                        <i className="fas fa-eye"></i>
                        {t('call-logs:actions.view')}
                      </Link>
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
    </div>
  );
};

export default NewCallLogsDashboard;