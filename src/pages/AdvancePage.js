import React, { useState } from 'react';
import './AdvancePage.css';

const AdvancePage = () => {
  const [filters, setFilters] = useState({
    type: 'All',
    status: 'All',
    startYear: '',
    startMonth: '',
    startDay: '',
    endYear: '',
    endMonth: '',
    endDay: '',
    genre: 'All'
  });

  const typeOptions = ['All', 'TV', 'Movie', 'OVA', 'ONA', 'Special'];
  const statusOptions = ['All', 'Airing', 'Completed', 'Upcoming'];
  const genreOptions = [
    'All', 'Action', 'Comedy', 'Fantasy', 'Mystery', 'School', 
    'Slice of Life', 'Sports', 'Sci-Fi', 'Romance', 'Drama', 'Horror', 'Adventure'
  ];

  const months = [
    'Month', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search filters:', filters);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = ['Year'];
    for (let year = currentYear; year >= 1960; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const generateDayOptions = () => {
    const days = ['Day'];
    for (let day = 1; day <= 31; day++) {
      days.push(day.toString());
    }
    return days;
  };

  return (
    <div className="advance-search-container">
      <div className="filter-section">
        <h2 className="filter-title">Filter</h2>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>Type</label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              {typeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="date-row">
          <div className="date-group">
            <label>Start Date</label>
            <div className="date-selects">
              <select 
                value={filters.startYear}
                onChange={(e) => handleFilterChange('startYear', e.target.value)}
                className="date-select year-select"
              >
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select 
                value={filters.startMonth}
                onChange={(e) => handleFilterChange('startMonth', e.target.value)}
                className="date-select month-select"
              >
                {months.map((month, index) => (
                  <option key={month} value={index === 0 ? '' : index}>{month}</option>
                ))}
              </select>
              <select 
                value={filters.startDay}
                onChange={(e) => handleFilterChange('startDay', e.target.value)}
                className="date-select day-select"
              >
                {generateDayOptions().map(day => (
                  <option key={day} value={day === 'Day' ? '' : day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="date-group">
            <label>End Date</label>
            <div className="date-selects">
              <select 
                value={filters.endYear}
                onChange={(e) => handleFilterChange('endYear', e.target.value)}
                className="date-select year-select"
              >
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select 
                value={filters.endMonth}
                onChange={(e) => handleFilterChange('endMonth', e.target.value)}
                className="date-select month-select"
              >
                {months.map((month, index) => (
                  <option key={month} value={index === 0 ? '' : index}>{month}</option>
                ))}
              </select>
              <select 
                value={filters.endDay}
                onChange={(e) => handleFilterChange('endDay', e.target.value)}
                className="date-select day-select"
              >
                {generateDayOptions().map(day => (
                  <option key={day} value={day === 'Day' ? '' : day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="genre-section">
          <h3 className="genre-title">Genre</h3>
          <div className="genre-dropdown">
            <select 
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="genre-select"
            >
              {genreOptions.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="filter-button" onClick={handleSearch}>
          Filter
        </button>
      </div>
    </div>
  );
};

export default AdvancePage;