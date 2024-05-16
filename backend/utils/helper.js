const axios = require('axios');
const RESULT_URL = require('../utils/config').RESULT_URL
const { AllResults } = require('../controllers/mongo')

const extractBatch = (registerNo) => {
  const matches = registerNo.match(/\d+/)
  if (!matches) return false

  const year = matches[0]
  if (year.length != 2) return false
  if (year > new Date().getFullYear().toString().slice(2)) return false

  return year
}

const cleanData = (data, allExamDefIds) => {
  if (!data.length) return { error: 'data is empty' };

  const semesters = []
  data.forEach(sem => {
    const filteredAllExamDefIds = allExamDefIds.filter(item => item.semester === sem.semesterName)[0].examDefId
    const results = []
    sem.resultDetails.forEach(element => {
      let x = {
        course: element.courseName,
        grade: element.grade,
        credit: element.credits
      }
      results.push(x)
    })
    const semesterDetails = {
      semester: sem.semesterName,
      examDefId: sem.resultDetails[0].examDefId,
      examName: sem.resultName,
      examMonth: sem.examMonth,
      examYear: sem.examYear,
      sgpa: calculateSgpa(results, getAllottedCredits(sem.semesterName)),
      allotedCredits: getAllottedCredits(sem.semesterName),
      results
    }
    results.some(item => item.grade === "F") && filteredAllExamDefIds.some(id => Number(id) > semesterDetails.examDefId) 
      ? semesterDetails.completed = false 
      : semesterDetails.completed = true

    const existingSemester = semesters.find((item) => item.semester === semesterDetails.semester)
    if (!existingSemester) {
        semesters.push(semesterDetails)
    } else {
      // Update results of existing semester
      semesterDetails.results.forEach((result) => {
        const existingResultIndex = existingSemester.results.findIndex((item) => item.course === result.course);
        
        // If result already exists, update it
        if (existingResultIndex !== -1) {
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
    dob: personalDetails.resultDetails[0].dateOfBirth,
    branch: personalDetails.branchName,
    college: personalDetails.institutionName,
    cgpa: calculateCgpa(semesters)
  }

  const cleanedData = { personalDetails, semesters }
  return cleanedData
}

const cleanSupplyData = (newData, oldData) => {
  if (!newData.resultDetails.length) return { error: 'new data is empty' }
  if (!oldData.semesters.length) return { error: 'old data is empty' }

  const newResults = []
  for (const result of newData.resultDetails) {
    let x = {
      course: result.courseName,
      grade: result.grade,
      credit: result.credits
    }
    newResults.push(x)
  }

  const newSemesterDetails = {
    semester: newData.semesterName,
    examDefId: newData.resultDetails[0].examDefId,
    newResults
  }

  oldData.semesters.forEach(oldSemester => {
    if (oldSemester.semester === newSemesterDetails.semester
      || ((oldSemester.semester === "S1" || oldSemester.semester === "S2")
        && (newSemesterDetails.semester === "S1" || newSemesterDetails.semester === "S2"))
    ) {
      newResults.forEach(newResult => {
        oldSemester.results.forEach(oldResult => {
          if (oldResult.course === newResult.course) {
            if (newResult.grade !== "F") {
              oldResult.grade = newResult.grade
              oldResult.credit = newResult.credit
              oldSemester.sgpa = calculateSgpa(oldSemester.results, oldSemester.allotedCredits)
              oldData.personalDetails.cgpa = calculateCgpa(oldData.semesters)
              oldSemester.lastExamDefId = newSemesterDetails.examDefId
            }
            oldSemester.completed = true
          }
        })
      })
    }
  })

  return oldData
}

const calculateSgpa = (result, credits) => {
  if (!result.length) return 0
  var sgpa = 0;

  result.forEach(course => {
    sgpa += getGradePoint(course.grade) * course.credit
  })
  sgpa = (sgpa / credits)
  // sgpa = Math.round((sgpa + Number.EPSILON) * 100) / 100

  return sgpa
}

const calculateCgpa = (semesters) => {
  if (!semesters.length) return 0
  var total_credits = 0, cgpa = 0
  semesters.forEach(sem => {
    total_credits += sem.allotedCredits
    cgpa += sem.sgpa * sem.allotedCredits
  })
  cgpa = (cgpa / total_credits)
  // cgpa = Math.round((cgpa + Number.EPSILON) * 100) / 100

  return cgpa
}

const getGradePoint = (grade) => {
  switch (grade) {
    case "S":
      gp = 10
      break;
    case "A+":
      gp = 9.0
      break;
    case "A":
      gp = 8.5
      break;
    case "B+":
      gp = 8.0
      break;
    case "B":
      gp = 7.5
      break;
    case "C+":
      gp = 7.0
      break;
    case "C":
      gp = 6.5
      break;
    case "D":
      gp = 6.0
      break;
    case "P":
      gp = 5.5
      break;
    case "F":
      gp = 0
      break;
    case "FE":
      gp = 0
      break;
    case "I":
      gp = 0
      break;
    default:
      break;
  }

  return gp
}

const getAllottedCredits = (sem) => {
  var credits = 0
  switch (sem) {
    case "S1":
      credits = 17
      break;
    case "S2":
      credits = 21
      break;
    case "S3":
      credits = 22
      break;
    case "S4":
      credits = 22
      break;
    case "S5":
      credits = 23
      break;
    case "S6":
      credits = 24
      break;
    case "S7":
      credits = 15
      break;
    case "S8":
      credits = 16
      break;
    default:
      break;
  }

  return credits
}


module.exports = {
  extractBatch,
  cleanData,
  cleanSupplyData,
  calculateSgpa,
  calculateCgpa,
}
