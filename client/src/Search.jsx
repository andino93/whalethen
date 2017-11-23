import React from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import SearchBar from './SearchBar';
import SearchList from './SearchList';
import Data from '../../sampleData';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationSearch: '',
      termBar: '',
      searchList: Data.sampleData,
      selectedDay: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleCat = this.handleCat.bind(this);
    this.handleLoc = this.handleLoc.bind(this);
    this.onDaySelect = this.onDaySelect.bind(this);
  }
  onSubmit() {
    const options = {
      params: {
        category: this.state.termBar,
        location: this.state.locationSearch,
      },
    };
    axios.get('/search', options)
      .then(({ data }) => {
        this.setState({
          searchList: data,
        });
      })
      .catch(err => console.error(err));
  }
  onDaySelect(e) {
    this.setState({
      selectedDay: e.target.value,
    });
  }
  handleCat(e) {
    this.setState({
      termBar: e.target.value,
    });
  }
  handleLoc(e) {
    this.setState({
      locationSearch: e.target.value,
    });
  }
  render() {
    return (
      <div className="container search">
        <SearchBar
          onSubmit={this.onSubmit}
          handleCat={this.handleCat}
          handleLoc={this.handleLoc}
        />
        <div className="scrollbox">
          <SearchList
            searchList={this.state.searchList}
            numberOfDays={this.props.numberOfDays}
            addNewEvent={this.props.addNewEvent}
            onDaySelect={this.onDaySelect}
            selectedDay={this.state.selectedDay}
          />
        </div>
      </div>
    );
  }
}


Search.propTypes = {
  numberOfDays: propTypes.number.isRequired,
  addNewEvent: propTypes.func.isRequired,
};

export default Search;
