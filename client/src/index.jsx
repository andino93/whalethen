import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import shortid from 'shortid';
import Search from './Search';
import Timeline from './Timeline';
import TimelineInputBox from './TimelineInputBox';
import StartDateBox from './StartDateBox';
import EndDateBox from './EndDateBox';
import CreateEventBox from './CreateEventBox';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timelineData: [],
      timelineName: 'test', // temp until we get some more data built up
      startDate: '',
      endDate: '',
      numberOfDays: 4,
      timelineId: 1234, // temp until we get a way to produce these
      createEventDay: '',
      newEvent: '',
      newEventAddress: '',
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.addNewEvent = this.addNewEvent.bind(this);
    this.getTrip = this.getTrip.bind(this);
    this.onCreateDaySelect = this.onCreateDaySelect.bind(this);
    this.handleNewEvent = this.handleNewEvent.bind(this);
    this.handleNewAddress = this.handleNewAddress.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }
  componentDidMount() {
    // on init function to make get request to server
    // temp using 1234 as the timelineId and test as timelineName
    this.getTrip();
  }

  onInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit() {
    this.setState({ timelineId: shortid.generate() });
    this.countDays();
    axios.post('/timeline', {
      timelineId: this.state.timelineId,
      numberOfDays: this.state.numberOfDays,
      timelineName: this.state.timelineName,
    });
  }

  onEnter(event) {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  onCreateDaySelect(e) {
    this.setState({
      createEventDay: e.target.value,
    });
  }

  getTrip() {
    axios.get(`timeline/${this.state.timelineName}/${this.state.timelineId}`)
      .then(({ data }) => {
        this.setState({
          timelineData: data,
          numberOfDays: data.length,
          timelineId: data[0].timelineId,
          timelineName: data[0].timelineName,
        });
      })
      .catch(err => console.error(err));
  }

  handleNewEvent(e) {
    this.setState({
      newEvent: e.target.value,
    });
  }

  handleNewAddress(e) {
    this.setState({
      newEventAddress: e.target.value,
    });
  }

  addNewEvent(event, selectedDay) {
    // input: event => {name, type}
    console.log('new event gooo')
    const day = Number(selectedDay.slice(4));
    axios.post('/entry', {
      event,
      timelineId: this.state.timelineId,
      day,
      timelineName: 'test',
    })
      .then(() => this.getTrip())
      .catch(err => console.error('add event error: ', err))
  }

  createEvent() {
    const eventObj = {
      name: this.state.newEvent,
      address: this.state.newEventAddress,
      votes: 0,
    };
    this.addNewEvent(eventObj, this.state.createEventDay);
    this.setState({
      newEvent: '',
      newEventAddress: '',
    });
  }

  countDays() {
    const start = moment(this.state.startDate);
    const end = moment(this.state.endDate);
    this.setState({ numberOfDays: end.diff(start, 'days'), timelineData: [] });
  }

  render() {
    return (
      <div className="App">
        <div className="container timelineParams">
          <div className="title">WhaleThen</div>
          <TimelineInputBox
            onInput={this.onInputChange}
            onEnter={this.onEnter}
          />
          <StartDateBox
            onInput={this.onInputChange}
            onEnter={this.onEnter}
          />
          <EndDateBox
            onInput={this.onInputChange}
            onEnter={this.onEnter}
          />
          <button
            className="scheduleSubmit"
            onClick={() => this.onSubmit()}
          >
            Make New Schedule
          </button>
        </div>
        <CreateEventBox
          timelineName={this.state.timelineName}
          addNewEvent={this.addNewEvent}
          numberOfDays={this.state.numberOfDays}
          onCreateDaySelect={this.onCreateDaySelect}
          createEventDay={this.state.createEventDay}
          handleNewEvent={this.handleNewEvent}
          handleNewAddress={this.handleNewAddress}
          createEvent={this.createEvent}
        />
        <Timeline timelineData={this.state.timelineData} />
        <Search
          numberOfDays={this.state.numberOfDays}
          addNewEvent={this.addNewEvent}
        />
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('app'));
