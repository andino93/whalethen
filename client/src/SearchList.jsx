import React from 'react';
import _ from 'lodash';
import propTypes from 'prop-types';
import SearchEntry from './SearchEntry';


const SearchList = (props) => {
  const {
    searchList,
    numberOfDays,
    addNewEvent,
    onDaySelect,
    selectedDay,
  } = props;

  return (
    <div className="searchList">
      {_.map(searchList, (event, index) => (
        <SearchEntry
          numberOfDays={numberOfDays}
          key={index}
          event={event}
          addNewEvent={addNewEvent}
          onDaySelect={onDaySelect}
          selectedDay={selectedDay}
        />
        ))}
    </div>
  );
};

SearchList.propTypes = {
  searchList: propTypes.instanceOf(Array).isRequired,
  addNewEvent: propTypes.func.isRequired,
  onDaySelect: propTypes.func.isRequired,
  selectedDay: propTypes.string.isRequired,
  numberOfDays: propTypes.number.isRequired,
};

export default SearchList;
