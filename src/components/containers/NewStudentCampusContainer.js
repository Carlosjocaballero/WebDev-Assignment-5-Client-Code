/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentCampusView from '../views/NewStudentCampusView';
import { addStudentThunk, fetchCampusThunk } from '../../store/thunks';

class NewStudentCampusContainer extends Component {
    // Initialize state
    constructor(props){
      super(props);
      this.state = {
        firstname: "", 
        lastname: "",
        email: "",
        imageUrl: null,
        gpa: null, 
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
  
      const firstName = event.target.firstname.value;
      const lastName = event.target.lastname.value;
      const email = event.target.email.value;
      
      if(firstName === "" || lastName === "" || email === ""){
        alert("Please make sure first name, last name and email are filled in.")
        return;
      }
  
  
      let student = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.email,
          imageUrl: this.state.imageUrl,
          gpa: this.state.gpa,
          campusId: this.props.campus.id
      };
      
      // Add new student in back-end database
      let newStudent = await this.props.addStudent(student);
  
      // Update state, and trigger redirect to show the new student
      this.setState({
        firstname: "", 
        lastname: "",
        email: "",
        iamgeUrl: null,
        gpa: null,
        redirect: true, 
        redirectId: newStudent.id
      });
    }
  
    // Unmount when the component is being removed from the DOM:
    componentWillUnmount() {
        this.setState({redirect: false, redirectId: null});
    }
  
    // Render new student input form
    render() {
      // Redirect to new student's page after submit
      if(this.state.redirect) {
        return (<Redirect to={`/student/${this.state.redirectId}`}/>)
      }
  
      // Display the input form via the corresponding View component
      return (
        <div>
          <Header />
          <NewStudentCampusView 
            handleChange = {this.handleChange} 
            handleSubmit={this.handleSubmit}
            campus={this.props.campus}  
          />
        </div>          
      );
    }
  }

  const mapState = (state) => {
    return {
        campus: state.campus,
    };
  };
  
  // The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
  // The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
  // The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
  const mapDispatch = (dispatch) => {
      return({
          addStudent: (student) => dispatch(addStudentThunk(student)),
          fetchCampus: (campusId) => dispatch(fetchCampusThunk(campusId))
      })
  }
  
  // Export store-connected container by default
  // NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
  // (and re-read the values when the Store State updates).
  export default connect(mapState, mapDispatch)(NewStudentCampusContainer);