/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus} = props;
  // If there are no camps, display a message
  // if(!campus.length){
  //   return(
  //   <div>
  //     <p>There are no campuses.</p>
  //     <Link to={`newcampus`}>
  //       <button>Add New Campus</button>
  //     </Link>
  //   </div> 
  //   );
  // }
  
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
            <div key={student.id}>
              <Link to={`/student/${student.id}`}>
                <h2>{name}</h2>
              </Link>             
            </div>
          );
        }) ) : (<p style={{fontWeight: 'bold'}}>[NO STUDENTS]</p>)}
    </div>
  );
};

export default CampusView;