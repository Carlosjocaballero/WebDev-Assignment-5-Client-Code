/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus, deleteCampus} = props;
  
  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      <img src={campus.imageUrl} alt={campus.name} style={{width: 500, height: 300}}></img>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      
      {campus.students.length ? 
        (campus.students.map( student => {
          let name = student.firstname + " " + student.lastname;
          return (
            <div>
              <div key={student.id}>
                <Link to={`/student/${student.id}`}>
                  <h2>{name}</h2>
                </Link>             
              </div>
              {/* <button onClick={() => removeStudent(student.id)}>Remove Student</button> */}
              <hr/>
            </div>
          );
        }) ) : (<p style={{fontWeight: 'bold'}}>[NO STUDENTS]</p>)}
      <Link to={`/editcampuses/${campus.id}`}>
        <button>Edit Campus</button>
      </Link>
      <Link to={`/campuses`}>
        <button onClick={() => deleteCampus(campus.id)}>Delete Campus</button>
      </Link>
    </div>
  );
};

export default CampusView;