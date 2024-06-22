"use client";

import { useState } from "react";
import resultService from "../services/results";
import Table from "./Table";
import styles from "../assets/styles.module.css";
import { useAptabase } from "@aptabase/react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const Form = () => {
  const [registerNo, setRegisterNo] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dob, setDob] = useState("");
  const { width, height } = useWindowSize();

  const { trackEvent } = useAptabase();

  const handleRegisterNo = (e) => {
    e.preventDefault();
    setIsLoading(true);
    resultService
      .getResults(registerNo, dob)
      .then((response) => {
        setResults(response.data);
        setIsLoading(false);
        trackEvent("result_search", {
          registerNumber: registerNo.toUpperCase(),
          college: response.data.personalDetails.college,
        });
      })
      .catch((error) => {
        if (error.response.status === 400) {
          alert(error.response.data.error);
        } else {
          alert("An error occurred. Please try again later.");
        }
        setIsLoading(false);
      });
  };

  const updateSemester = (semester, examDefId) => {
    resultService
      .updateResults(registerNo, dob, semester, examDefId, results)
      .then((response) => {
        const newResults = response.data;
        setResults(newResults);
      });
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>Finding results for {registerNo}...</div>
    );
  }

  return (
    <div>
      {results.length === 0 ? (
        <form onSubmit={handleRegisterNo}>
          <h1>Enter your register number to find results</h1>
          <input
            type="text"
            value={registerNo}
            placeholder="Register Number"
            onChange={(e) => setRegisterNo(e.target.value.toUpperCase())}
            required
          />
          <input
            type="text"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
          <div className={styles.buttonDiv}>
            <button
              className={styles.resultButton}
              type="submit"
              disabled={isLoading}>
              Find Results
            </button>
          </div>
        </form>
      ) : (
        <div>
          {results.personalDetails.cgpa > 9.0 ? (
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={1000}
              tweenDuration={20000}
            />
          ) : null}
          <button
            className={styles.resultButton}
            onClick={() => {
              setResults([]);
              setRegisterNo("");
            }}>
            Check another result
          </button>
          <Table data={results} updateSemester={updateSemester} />
        </div>
      )}
    </div>
  );
};

export default Form;
