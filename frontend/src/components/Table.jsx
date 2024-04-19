import ResultTable from "./ResultTable"
import styles from '../assets/table.module.css'
import resultService from '../services/results'

const Table = ({ data, updateSemester }) => {
  const personalDetails = data.personalDetails
  var semesters = data.semesters.sort((a, b) => b.semester.localeCompare(a.semester))

  if (!personalDetails || !semesters) {
    return null
  }

  // const failedSemesters = []
  // semesters.forEach(semester => {
  //   for (const result of semester.results) {
  //     if (result.grade === "F") {
  //       if (!(failedSemesters.includes(semester.examDefId))) {
  //         failedSemesters.push(semester.examDefId)
  //       }
  //     }
  //   }
  // })
  
  return (
    <div className={styles.table}>
      <div className={styles.student}>
        <h2>Student Details</h2>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Full Name</td>
              <td>{personalDetails.fullName}</td>
            </tr>
            <tr>
              <td>Register Number</td>
              <td>{personalDetails.registerNo}</td>
            </tr>
            <tr>
              <td>Branch</td>
              <td>{personalDetails.branch}</td>
            </tr>
            <tr>
              <td>College</td>
              <td>{personalDetails.college}</td>
            </tr>
            <tr>
              <td>CGPA</td>
              <td style={{ color: personalDetails.cgpa >= 7.5 ? "green" : "red" }}>{personalDetails.cgpa}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
      <div>
        <h2>Semester Details</h2>
        <div>
          {semesters.map(sem => (
            <ResultTable key={sem.semester} result={sem} updateSemester={updateSemester} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Table
