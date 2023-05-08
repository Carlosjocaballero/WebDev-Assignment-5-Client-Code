/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchStudentThunk, editStudentThunk} from '../../store/thunks';
import EditStudentView from "../views/EditStudentView";

class EditStudentContainer extends Component {
    // Initialize state
    constructor(props){
        super(props);
        this.state = {
            id: null,
            firstname: "",
            lastname: "",
            email: "",
            imageUrl: null,
            gpa: null, 
            campusId: null,
            redirect: false,
            redirectId: null
        };
    }

    componentDidMount() {
        this.props.fetchStudent(this.props.match.params.id)
    }

    // Capture input data when it is entered
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Take action after user click the submit button
    handleSubmit = async event => {
        event.preventDefault(); // Prevent browser reload/refresh after submit

        const firstName = event.target.firstname.value;
        const lastName = event.target.lastname.value;
        const email = event.target.email.value;

        if(firstName.trim() !== firstName || lastName.trim() !== lastName || email.trim() !== email){
            alert("Please make sure first name and last name are filled in or that they don't have whitespace")
            return;
        }

        let student = {
            id: this.props.student.id,
            firstname: this.state.firstname === "" ? this.props.student.firstname : this.state.firstname,
            lastname: this.state.lastname === "" ? this.props.student.lastname : this.state.lastname,
            email: this.state.email === "" ? this.props.student.email : this.state.email,
            imageUrl: this.state.imageUrl == null ? this.props.student.imageUrl : this.state.imageUrl,
            gpa: this.state.gpa == null ? this.props.student.gpa : this.state.gpa,
            campusId: this.state.campusId === null ? this.props.student.campusId : this.state.campusId           
        };

        // Edit student in back-end database
        console.log(student)
        await this.props.editStudent(student);

        // Update state, and trigger redirect to show new student
        this.setState({
            firstname: "", 
            lastname: "",
            email: "",
            imageUrl: null,
            gpa: null,
            campusId: null, 
            redirect: true, 
            redirectId: this.props.student.id            
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
                <EditStudentView 
                    handleChange = {this.handleChange} 
                    handleSubmit={this.handleSubmit}
                    student = {this.props.student}      
                />
            </div>          
        );
    }
}

const mapState = (state) => {
    return {
        student: state.student,
    };
};

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return{
        editStudent: (student) => dispatch(editStudentThunk(student)),
        fetchStudent: (studentId) => dispatch(fetchStudentThunk(studentId)),
    };
};

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);