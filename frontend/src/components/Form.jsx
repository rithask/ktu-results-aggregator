'use client'

import { useState } from "react"
import resultService from "../services/results"
import Table from "./Table"
import styles from '../assets/styles.module.css'
import { useAptabase } from "@aptabase/react"

const Form = () => {
  const [registerNo, setRegisterNo] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { trackEvent } = useAptabase()

  const handleRegisterNo = (e) => {
    e.preventDefault()
    setIsLoading(true)
    resultService.getResults(registerNo)
      .then((response) => {
        setResults(response.data)
        setIsLoading(false)
        trackEvent('result_search', { registerNumber: registerNo.toUpperCase(), college: response.data.personalDetails.college })
      })
      .catch((error) => {
        if (error.response.status === 400) {
          alert(error.response.data.error)
        } else {
          alert('An error occurred. Please try again later.')
        }
        setIsLoading(false)
      })
  }

  const updateSemester = (semester, examDefId) => {
    resultService.updateResults(registerNo, semester, examDefId, results)
      .then(response => {
        const newResults = response.data
        setResults(newResults)
      })
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        Finding results for {registerNo}...
      </div>
    )
  }

  return (
    <div>
      { results.length === 0 ? 
      (<form onSubmit={handleRegisterNo}>
        <h1>Enter your register number to find results</h1>
        <div>
          {/* <label htmlFor="registerNo">Enter your registration number: */}
            <input
              type="text"
              value={registerNo}
              // value="MAC21CS040"
              placeholder="Register Number"
              onChange={(e) => setRegisterNo(e.target.value)}
              required
            />
          {/* </label> */}
        </div>
        <div className={styles.buttonDiv}>
          <button className={styles.resultButton} type="submit" disabled={isLoading}>Find Results</button>
        </div>
      </form>
      ): (
        <div>
          <button className={styles.resultButton} onClick={() => {setResults([]); setRegisterNo('');}}>Check another result</button>
          <Table data={results} updateSemester={updateSemester} />
        </div>
      )}
    </div>
  )
}

export default Form
