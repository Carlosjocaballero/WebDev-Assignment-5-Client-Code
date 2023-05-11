/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";
import { useState } from "react";
// Take in props data to construct the component
const CampusView = (props) => {
  const {campus, deleteCampus, fetchStudent, editStudent, fetchAllStudents} = props;
  
  let campus_photo;

  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState([]);

  !campus.imageUrl ? campus_photo = 'https://helloartsy.com/wp-content/uploads/kids/places/how-to-draw-a-college/how-to-draw-a-college-step-4.jpg' : campus_photo = campus.imageUrl;

  async function addAvaliableStudent(studentId){
    let thisStudent = fetchStudent(studentId);
    let student;
    thisStudent.then(res => {
      student = res.data;
      student.campusId = campus.id;
      editStudent(student)
      window.location.reload(true);
    })
  }

  async function showAvaliableStudents(){
    setStudents([]);
    setShowStudents(true);
    let allStudents = fetchAllStudents();
    allStudents.then(res => {
      res.forEach(student => {
        if(student.campusId !== campus.id && student.campusId === null)
          setStudents(prevStudents => [...prevStudents, student]);
      })
    })
  }
   
  async function removeStudent(studentId) {
    let thisStudent = fetchStudent(studentId);
    let student;
    thisStudent.then(res => {
      student = res.data;
      student.campusId = null;
      editStudent(student);
      window.location.reload(true);
    })
  }

  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      <img src={campus_photo} alt={campus.name} style={{width: 500, height: 300}}></img>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      <p style={{fontWeight: 'bold'}}>Students: </p>
      {campus.students.length ? 
        (campus.students.map( student => {
          let name = student.firstname + " " + student.lastname;
          return (
              <div key={student.id}>
                  <Link to={`/student/${student.id}`}>
                    <h2>{name}</h2>
                  </Link>
                  <button onClick={() => removeStudent(student.id)}>Remove Student</button>
                <hr/>
              </div>
            );
          })
        ): (<p style={{fontWeight: 'bold'}}>[NO STUDENTS]</p>)}
      <br/>
      <div hidden={!showStudents}>
        <h3>Add Avaliable student:</h3>
        {
          students.length === 0  ? <p style={{fontWeight: 'bold'}}>[NO STUDENTS]</p> :
          students.map((student) => {
            let name = student.firstname + " " + student.lastname;
            return (
              <div key={student.id}>
                <Link to={`/student/${student.id}`}>
                  <h2>{name}</h2>
                </Link>
                <button onClick={() => addAvaliableStudent(student.id)}>Add Student</button>
              </div>
            );
          })
        }
      </div>
      <Link to={`/newstudentcampus/${campus.id}`}>
        <button>Add New Student</button>
      </Link>
      <button onClick={() => showAvaliableStudents()}>Add Avaliable Students</button>
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