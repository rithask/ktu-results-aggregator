const axios = require('axios');
const RESULT_URL = require('../utils/config').RESULT_URL
const { AllResults } = require('../controllers/mongo')

const extractBatch = (registerNo) => {
  const matches = registerNo.match(/\d+/)
  if (!matches) return false

  const year = matches[0]
  if (year.length != 2) return false

  return year
}

const cleanData = (data) => {
  if (!data.length) return { error: 'data is empty' };

  const semesters = []
  data.forEach(sem => {
    const results = []
    sem.resultDetails.forEach(element => {
      let x = {
        course: element.courseName,
        grade: element.grade,
        credit: element.credits
      }
      results.push(x);
    })
    const semesterDetails = {
      semester: sem.semesterName,
      examDefId: sem.resultDetails[0].examDefId,
      examName: sem.resultName,
      examMonth: sem.examMonth,
      examYear: sem.examYear,
      results
    }
    const existingSemester = semesters.find((item) => item.semester === semesterDetails.semester)
    if (!existingSemester) {
        semesters.push(semesterDetails)
    } else {
      // Update results of existing semester
      semesterDetails.results.forEach((result) => {
        const existingResultIndex = existingSemester.results.findIndex((item) => item.course === result.course);
        
        // If result already exists, update it
        if (existingResultIndex !== -1) {
          result.supply = true;
          existingSemester.results[existingResultIndex] = result;
        } else {
          // If result doesn't exist, add it to existing semester
          existingSemester.results.push(result);
        }
      })
    }
  })

  var personalDetails = data[0]
  var personalDetails = {
    firstName: personalDetails.firstName,
    middleName: personalDetails.middleName,
    surName: personalDetails.surName,
    fullName: personalDetails.fullName,
    registerNo: personalDetails.registerNo,
    branch: personalDetails.branchName,
    college: personalDetails.institutionName,
  }
    
  const cleanedData = { personalDetails, semesters }
  return cleanedData
}



module.exports = {
  extractBatch,
  cleanData,
}
