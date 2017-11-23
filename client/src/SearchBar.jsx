import React from 'react';
import propTypes from 'prop-types';

const SearchBar = ({ onSubmit, handleLoc, handleCat }) => (
  <div className="searchBar">
    <input onChange={e => handleLoc(e)} />
    <button className="searchSubmit" onClick={onSubmit}>Search</button>
  </div>
);

SearchBar.propTypes = {
  onSubmit: propTypes.func.isRequired,
  handleLoc: propTypes.func.isRequired,
  handleCat: propTypes.func.isRequired,
};


export default SearchBar;
