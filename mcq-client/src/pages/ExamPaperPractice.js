import React, { useEffect, useState, useRef } from "react";
import { useTimer } from "react-timer-hook";
import {
  Avatar,
  Box,
  Button,
  Container,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Toolbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import PracticeExamResult from "../masters/examResult/PracticeExamResult";
function MyTimer({ expiryTimestamp, onExpire, onTimerSubmit, examStatus }) {
  const {
    seconds,
    minutes,
    hours,
    // days,
    // isRunning,
    // start,
    // pause,
    // resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn("onExpire called");
      if (examStatus === "wait") {
        onExpire();
        setTimeout(() => {
          restartTimer(onExpire());
        }, 2000);
      } else if (examStatus === "start") {
        onTimerSubmit();
      }
    },
  });
  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  function restartTimer(timeDiff) {
    const time = new Date();
    time.setSeconds(time.getSeconds() + timeDiff);
    restart(time);
  }
  return (
    <Container>
      <Typography variant="h3" align="center">
        {formatTime(hours)} : {formatTime(minutes)} : {formatTime(seconds)}
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        {examStatus === "wait"
          ? "remaining to starts the exam"
          : "remaining to finish the exam"}
      </Typography>
      {/* <div></div>
      <p>{isRunning ? "Running" : "Not running"}</p> */}
    </Container>
  );
}

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const theme = createTheme();

export default function ExamPaperPractice() {
  const location = useLocation();
  const [examDetails] = useState(location.state.examData);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);

  const inputSubmit = useRef(null);
  const getQuestionsforExam = async (examId) => {
    const result = await fetch(`http://localhost:5000/questions/${examId}`);
    const record = await result.json();
    setQuestions(record);
  };
  
  useEffect(() => {
    getQuestionsforExam(examDetails.examId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let myAns = [];

    let output = {};
    data.forEach((value, key) => {
      // Check if property already exist
      if (Object.prototype.hasOwnProperty.call(output, key)) {
        let current = output[key];
        if (!Array.isArray(current)) {
          // If it's not an array, convert it to an array.
          current = output[key] = [current];
        }
        current.push(value); // Add the new value to the array.
        const updateAnsIndex = myAns.findIndex(
          (item) => item.questionNo === key.split("_").pop()
        );
        myAns[updateAnsIndex].ans = current.sort().join("[|]");
      } else {
        output[key] = value;
        myAns.push({
          examId: examDetails.examId,
          questionNo: parseInt(key.split("_").pop()),
          ans: value,
        });
      }
    });
    console.log(myAns);
    var positiveMark = 0;
    var negativeMark = 0;

    const InputedWithCorrectAns = myAns.map((item, i) => {
      if (
        item.examId === questions[i].exam_Id &&
        item.questionNo === questions[i].questionNo
      ) {
        if (item.ans === questions[i].correctAnswer) {
          positiveMark = positiveMark + questions[i].mark;
        } else {
          negativeMark = negativeMark + questions[i].negativeMark;
        }

        return Object.assign({}, item, questions[i]);
      }
      return {};
    });
    console.log(InputedWithCorrectAns);
    setResult({
      numberOfQuestions: questions.length,
      attendedQuestions: InputedWithCorrectAns.length,
      positiveMarks: positiveMark,
      negativeMarks: negativeMark,
      marks: positiveMark - negativeMark,
      status:
        positiveMark - negativeMark >= examDetails.passMark ? "Pass" : "Fail",
    });
  };

  const handleExpireTimer = () => {
    var endDt = new Date(examDetails.endTo);
    var examEndTime = new Date();
    examEndTime.setHours(
      endDt.getHours(),
      endDt.getMinutes(),
      endDt.getSeconds(),
      endDt.getMilliseconds()
    );
    var dif = (examEndTime.getTime() - new Date().getTime()) / 1000;
    if (getQuestionsforExam(examDetails.examId)) {
      return dif;
    }
  };

  const handleFormSubmit = () => {
    inputSubmit.current.click();
  };
  const time = new Date();
  time.setSeconds(
    time.getSeconds() +
      (new Date(examDetails.endTo).getTime() -
        new Date(examDetails.startsFrom).getTime()) /
        1000
  );

  return (
    <>
      {result === null ? (
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <CssBaseline />
            <Toolbar sx={{ mt: 15 }}>
              <MyTimer
                expiryTimestamp={time}
                onExpire={handleExpireTimer}
                onTimerSubmit={handleFormSubmit}
              />
            </Toolbar>
            <Container>
              <Box
                sx={{ my: 2 }}
                component="form"
                noValidate
                onSubmit={handleSubmit}
              >
                {questions.map((ques) => {
                  return (
                    <Box
                      key={ques.questionNo}
                      sx={{
                        m: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "secondary.main" }}>
                          {ques.questionNo}
                        </Avatar>
                        <Typography variant="h6" noWrap>
                          {ques.question}
                        </Typography>
                      </Stack>
                      <Container sx={{ mx: 5 }}>
                        {ques.question_Type_Id === 1 ? (
                          <RadioGroup
                            row
                            aria-label="level"
                            name="row-radio-buttons-group"
                            style={{ flexWrap: "nowrap" }}
                          >
                            <FormControlLabel
                              control={
                                <Radio
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionA}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionA}
                              style={{ width: "-webkit-fill-available" }}
                            />
                            <FormControlLabel
                              control={
                                <Radio
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionB}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionB}
                              style={{ width: "-webkit-fill-available" }}
                            />
                            <FormControlLabel
                              control={
                                <Radio
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionC}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionC}
                              style={{ width: "-webkit-fill-available" }}
                            />
                            <FormControlLabel
                              control={
                                <Radio
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionD}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionD}
                              style={{ width: "-webkit-fill-available" }}
                            />
                          </RadioGroup>
                        ) : ques.question_Type_Id === 2 ? (
                          <FormGroup
                            row
                            aria-label="level"
                            name="row-check-box-group"
                            style={{ flexWrap: "nowrap" }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionA}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionA}
                              style={{ width: "-webkit-fill-available" }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionB}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionB}
                              style={{ width: "-webkit-fill-available" }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionC}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionC}
                              style={{ width: "-webkit-fill-available" }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={`ansForQues_${ques.questionNo}`}
                                  color="primary"
                                  value={ques.optionD}
                                  // onChange={handleChange}
                                />
                              }
                              label={ques.optionD}
                              style={{ width: "-webkit-fill-available" }}
                            />
                          </FormGroup>
                        ) : ques.question_Type_Id === 3 ? (
                          <TextField
                            name={`ansForQues_${ques.questionNo}`}
                            margin="normal"
                            variant="standard"
                            fullWidth
                          />
                        ) : null}
                      </Container>
                    </Box>
                  );
                })}
                {questions.length > 0 ? (
                  <Button
                    ref={inputSubmit}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    SUBMIT
                  </Button>
                ) : null}
              </Box>
            </Container>
          </React.Fragment>
        </ThemeProvider>
      ) : (
        <PracticeExamResult data={result} />
      )}
    </>
  );
}
