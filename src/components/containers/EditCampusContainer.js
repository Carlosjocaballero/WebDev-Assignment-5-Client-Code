/*==================================================
EditCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchCampusThunk, editCampusThunk } from '../../store/thunks';
import EditCampusView from '../views/EditCampusView';

class EditCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = { 
      name: "",
      address: "",
      description: null,
      imageUrl: null, 
      redirect: false, 
      redirectId: null,
    };
  }

  componentDidMount() {
    this.props.fetchCampus(this.props.match.params.id)
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    const name = event.target.name.value;
    const address = event.target.address.value;
    
    if(name.trim() !== name || address.trim() !== address){
      alert("Please make sure name and address are filled in or that they don't have whitespace")
      return;
    }


    let campus = {
        name: this.state.name === "" ? this.props.campus.name : this.state.name,
        address: this.state.address === "" ? this.props.campus.address : this.state.address,
        description: this.state.description == null ? this.props.campus.description : this.state.description,
        imageUrl: this.state.imageUrl === null ? this.props.campus.imageUrl : this.state.imageUrl,
        id: this.props.campus.id
    };
    
    // Edit campus in back-end database
    await this.props.editCampus(campus);

    // Update state, and trigger redirect to show the new campus
    this.setState({
      name: "",
      address: "",
      description: null,
      imageUrl: null,
      redirect: true, 
      redirectId: this.props.campus.id
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new campus input form
  render() {
    // Redirect to new campus's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditCampusView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit} 
          campus = {this.props.campus}     
        />
      </div>          
    );
  }
}

const mapState = (state) => {
    return {
        campus: state.campus,
    };
}

// The following input argument is passed to the "connect" function used by "NewCampusContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        editCampus: (campus) => dispatch(editCampusThunk(campus)),
        fetchCampus: (campusId) => dispatch(fetchCampusThunk(campusId)),
    })
}

// Export store-connected container by default
// NewCampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);