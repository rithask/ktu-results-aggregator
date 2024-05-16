const ResultTable = ({ result, updateSemester }) => {
  if (!result) {
    return null
  }

  return (
    <div>
      <div>
        <h1>{result.semester}</h1>
        {!result.completed && <button onClick={() => updateSemester(result.semester, result.lastExamDefId || result.examDefId)}>Update</button>}
      </div>
      <p>SGPA: {result.sgpa.toFixed(2)}</p>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {result.results.map(sub => (
            <tr key={sub.course} style={{ color: ["S", "O"].includes(sub.grade) ? "green" : ["F", "AB", "FE"].includes(sub.grade) ? "red" : "inherit" }}>
              <td>{sub.course}</td>
              <td>{sub.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultTable
