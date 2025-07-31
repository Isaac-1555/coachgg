import React, { useState } from 'react';
import { 
  IconCalendar, 
  IconFilter, 
  IconDownload, 
  IconRefresh,
  IconZoom,
  IconX
} from '@tabler/icons-react';
import '../../styles/ChartControls.css';

const ChartControls = ({ 
  onDateRangeChange, 
  onGameFilterChange, 
  onResultFilterChange,
  onExport,
  onRefresh,
  availableGames = [],
  dateRange = { start: '', end: '' },
  gameFilter = 'all',
  resultFilter = 'all',
  showExport = true,
  showRefresh = true,
  showFilters = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');

  const handleDateChange = (field, value) => {
    const newRange = { ...dateRange, [field]: value };
    onDateRangeChange?.(newRange);
  };

  const handleExport = () => {
    onExport?.(exportFormat);
  };

  const clearFilters = () => {
    onDateRangeChange?.({ start: '', end: '' });
    onGameFilterChange?.('all');
    onResultFilterChange?.('all');
  };

  const hasActiveFilters = dateRange.start || dateRange.end || gameFilter !== 'all' || resultFilter !== 'all';

  return (
    <div className="chart-controls">
      <div className="controls-header">
        <button 
          className={`controls-toggle ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <IconFilter size={16} />
          <span>Filters & Controls</span>
          {hasActiveFilters && <div className="active-indicator" />}
        </button>
        
        <div className="quick-actions">
          {showRefresh && (
            <button className="control-button" onClick={onRefresh} title="Refresh Data">
              <IconRefresh size={16} />
            </button>
          )}
          {showExport && (
            <div className="export-group">
              <select 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e.target.value)}
                className="export-format"
              >
                <option value="png">PNG</option>
                <option value="pdf">PDF</option>
                <option value="svg">SVG</option>
              </select>
              <button className="control-button" onClick={handleExport} title="Export Chart">
                <IconDownload size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && showFilters && (
        <div className="controls-panel">
          <div className="controls-grid">
            {/* Date Range Filter */}
            <div className="control-group">
              <label className="control-label">
                <IconCalendar size={14} />
                Date Range
              </label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="date-input"
                  placeholder="Start date"
                />
                <span className="date-separator">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="date-input"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Game Filter */}
            <div className="control-group">
              <label className="control-label">Game</label>
              <select 
                value={gameFilter} 
                onChange={(e) => onGameFilterChange?.(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Games</option>
                {availableGames.map(game => (
                  <option key={game.id || game.name} value={game.name}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Result Filter */}
            <div className="control-group">
              <label className="control-label">Result</label>
              <select 
                value={resultFilter} 
                onChange={(e) => onResultFilterChange?.(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Results</option>
                <option value="win">Wins Only</option>
                <option value="loss">Losses Only</option>
                <option value="draw">Draws Only</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="controls-footer">
              <button className="clear-filters-button" onClick={clearFilters}>
                <IconX size={14} />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartControls;