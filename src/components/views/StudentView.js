/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Link } from "react-router-dom"
const StudentView = (props) => {
  const { student, deleteStudent } = props;

  // Render a single Student view 
  return (
    <div>
      <h1>{student.firstname + " " + student.lastname}</h1>
      {student.imageUrl && <img src={student.imageUrl} alt={student.name} style={{width: 200, height: 100}}></img>}
      {student.email && <p>{student.email}</p>}
      {student.gpa && <p>GPA: {student.gpa}</p>}
      {student.campus ? (<Link to={`/campus/${student.campus.id}`}><h3>{student.campus.name}</h3></Link>) : (<p style={{fontWeight: 'bold'}}>[STUDENT IS IN NO CAMPUS]</p>)}
      <Link to={`/editstudents/${student.id}`}>
        <button>Edit Student</button>
      </Link>
      <Link to={`/students`}>
        <button onClick={() => deleteStudent(student.id)}>Delete Student</button>
      </Link>
    </div>
  );

};

export default StudentView;