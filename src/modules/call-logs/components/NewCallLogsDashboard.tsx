import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useClinic } from '../../clinics/hooks/useClinic';
import CallLogService from '../CallLogService';
import { CallLogListView } from '../CallLogModel';
import { LoadingScreen } from '../../../@zenidata/components/UI/Loader';
import { useDebounce } from '../../../@zenidata/hooks/useDebounce';
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
  refreshInterval = 30000, // 30 seconds
  showFilters = true
}) => {
  const { t } = useTranslation(['call-logs', 'core']);
  const { selectedClinic } = useClinic();
  
  // State management
  const [callLogs, setCallLogs] = useState<CallLogListView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  
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
  const fetchNewCalls = useCallback(async () => {
    if (!selectedClinic?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const newCalls = await CallLogService.getNewCallLogs(
        selectedClinic.id,
        Math.min(maxItems, 50) // API limit is 50
      );
      
      setCallLogs(newCalls);
      setPagination(prev => ({
        ...prev,
        totalItems: newCalls.length,
        totalPages: Math.ceil(newCalls.length / prev.itemsPerPage)
      }));
      setLastFetchTime(new Date());
    } catch (err) {
      setError(t('call-logs:errors.fetchFailed'));
      console.error('Error fetching new calls:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedClinic?.id, maxItems, t]);

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
      setPagination(prev => ({
        ...prev,
        totalItems: result.total,
        totalPages: result.pages
      }));
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
      fetchNewCalls();
    }
  }, [hasActiveFilters, fetchNewCalls, fetchFilteredCalls]);

  // Auto-refresh effect for new calls only (not filtered results)
  useEffect(() => {
    if (!hasActiveFilters && refreshInterval > 0) {
      const interval = setInterval(fetchNewCalls, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [hasActiveFilters, refreshInterval, fetchNewCalls]);

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
    if (hasActiveFilters) {
      // Server-side pagination for filtered results
      return callLogs;
    } else {
      // Client-side pagination for new calls
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      return callLogs.slice(startIndex, endIndex);
    }
  }, [callLogs, pagination.currentPage, pagination.itemsPerPage, hasActiveFilters]);

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
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h2 className="dashboard-title">
            {hasActiveFilters 
              ? t('call-logs:dashboard.filteredCallsTitle')
              : t('call-logs:dashboard.newCallsTitle')
            }
          </h2>
          <div className="header-meta">
            {lastFetchTime && (
              <span className="last-updated">
                {t('call-logs:dashboard.lastUpdated')}: {lastFetchTime.toLocaleTimeString()}
              </span>
            )}
            {!hasActiveFilters && (
              <div className="auto-refresh-indicator">
                <i className="fas fa-sync-alt"></i>
                {t('call-logs:dashboard.autoRefresh')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Section */}
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
          </div>
          
          {hasActiveFilters && (
            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                <i className="fas fa-times"></i>
                {t('call-logs:filters.clearAll')}
              </button>
            </div>
          )}
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
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
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
              <button onClick={hasActiveFilters ? fetchFilteredCalls : fetchNewCalls} className="retry-btn">
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
                  <th>{t('call-logs:table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCallLogs.map((callLog) => (
                  <tr key={callLog.id} className="call-log-row">
                    <td className="caller-name">
                      {callLog.caller_first_name || callLog.caller_last_name
                        ? `${callLog.caller_first_name || ''} ${callLog.caller_last_name || ''}`.trim()
                        : '-'
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
                      {callLog.reason_for_call || '-'}
                    </td>
                    <td className="actions">
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
                ))}
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
              const pageNumber = Math.max(1, Math.min(
                pagination.currentPage - 2 + index,
                pagination.totalPages - 4 + index
              ));
              
              if (pageNumber > pagination.totalPages) return null;
              
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