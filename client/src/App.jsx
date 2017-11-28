import React from 'react';
import axios from 'axios';
import moment from 'moment';
import shortid from 'shortid';
import Search from './Search';
import Timeline from './Timeline';
import TimelineInputBox from './TimelineInputBox';
import TimelineLookUp from './TimelineLookUp';
import StartDateBox from './StartDateBox';
import EndDateBox from './EndDateBox';
import CreateEventBox from './CreateEventBox';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timelineData: [],
      timelineName: '', // temp until we get some more data built up
      startDate: '',
      endDate: '',
      numberOfDays: 0,
      timelineId: '', // temp until we get a way to produce these
      createEventDay: '',
      newEvent: '',
      newEventAddress: '',
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.addNewEvent = this.addNewEvent.bind(this);
    this.getTrip = this.getTrip.bind(this);
    this.handleID = this.handleID.bind(this);
    this.handleName = this.handleName.bind(this);
    this.onLookupEnter = this.onLookupEnter.bind(this);
    this.onCreateDaySelect = this.onCreateDaySelect.bind(this);
    this.onCreateEnter = this.onCreateEnter.bind(this);
    this.handleNewEvent = this.handleNewEvent.bind(this);
    this.handleNewAddress = this.handleNewAddress.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }
  componentDidMount() {
    // on init function to make get request to server
    // temp using 1234 as the timelineId and test as timelineName
    // this.getTrip();
  }

  onInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit() {
    this.setState({ timelineId: shortid.generate() }, () => {
      const start = moment(this.state.startDate);
      const end = moment(this.state.endDate);
      this.setState({ numberOfDays: end.diff(start, 'days') }, () => {
        axios.post('/timeline', {
          timelineId: this.state.timelineId,
          timelineName: this.state.timelineName,
          numberOfDays: this.state.numberOfDays,
        })
          .then(() => this.getTrip())
          .catch(err => console.error('error in submit ', err));
      });
    });
  }

  onEnter(event) {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  onCreateEnter(event) {
    if (event.key === 'Enter') {
      this.createEvent();
    }
  }

  onCreateDaySelect(e) {
    this.setState({
      createEventDay: e.target.value,
    });
  }

  onLookupEnter(event) {
    if (event.key === 'Enter') {
      this.getTrip();
    }
  }

  getTrip() {
    axios.get(`/timeline/${this.state.timelineName}/${this.state.timelineId}`)
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

  handleID(e) {
    this.setState({
      timelineId: e.target.value,
    });
  }

  handleName(e) {
    this.setState({
      timelineName: e.target.value,
    });
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
    const day = Number(selectedDay.slice(4));
    axios.post('/entry', {
      event,
      timelineId: this.state.timelineId,
      day,
      timelineName: this.state.timelineId,
    })
      .then(() => this.getTrip())
      .catch(err => console.error('add event error: ', err));
  }

  createEvent() {
    const eventObj = {
      name: this.state.newEvent,
      address: this.state.newEventAddress,
      votes: 0,
    };
    this.addNewEvent(eventObj, this.state.createEventDay);
  }

  render() {
    return (
      <div className="App">
        <div className="title">WhaleThen</div>
        <div className="container timelineParams">
          <div className="label">{this.state.timelineName}</div>
          <div className="label">{this.state.timelineId}</div>

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
            New Schedule
          </button>
        </div>
        <CreateEventBox
          timelineId={this.state.timelineId}
          numberOfDays={this.state.numberOfDays}
          onCreateDaySelect={this.onCreateDaySelect}
          onCreateEnter={this.onCreateEnter}
          createEventDay={this.state.createEventDay}
          handleNewEvent={this.handleNewEvent}
          handleNewAddress={this.handleNewAddress}
          createEvent={this.createEvent}
        />
        <TimelineLookUp
          getTrip={this.getTrip}
          handleID={this.handleID}
          handleName={this.handleName}
          onLookupEnter={this.onLookupEnter}
        />
        <Timeline timelineData={this.state.timelineData} timelineId={this.state.timelineId} />
        <Search
          numberOfDays={this.state.numberOfDays}
          addNewEvent={this.addNewEvent}
        />
      </div>
    );
  }
}

export default App;
