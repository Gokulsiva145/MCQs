import React, { useEffect, useState, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useTimer } from "react-timer-hook";
import moment from "moment";
import {
  Avatar,
  Box,
  Button,
  Container,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Toolbar,
} from "@mui/material";
import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import {  useNavigate } from "react-router-dom";

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
    </Container>
  );
}
const theme = createTheme();

export default function ExamPaper() {
  const navigate = useNavigate();
  const [auth] = useState(sessionStorage.getItem("studentData"));
  const [time] = useState(new Date());
  const [currentExam, setCurrentExam] = useState([]);
  const [examStatus, setExamStatus] = useState("wait");
  const [questions, setQuestions] = useState([]);

  const inputSubmit = useRef(null);

  const getQuestionsforExam = async (examId) => {
    const result = await fetch(`http://localhost:5000/questions/${examId}`);
    const record = await result.json();
    setQuestions(record);
  };

  const getCurrentExam = async () => {
    let QueryString = [
      `examDate=${moment().format("YYYY-MM-DD")}`,
      `studentRegNo=${auth.registrationNo}`,
      "writtenStatus=0",
      `currentTime=${moment.utc().format("HH:mm:ss")}`,
    ].join("&");
    const result = await fetch(
      `http://localhost:5000/examAccess/filterExamAccess?${QueryString}`
    );
    const record = await result.json();
    console.log(record);
    if (record.length > 0) {
      setCurrentExam(record);
    }
  };
  useEffect(() => {
    getCurrentExam();
  }, []);

  useEffect(() => {
    if (currentExam.length > 0) {
      var examTime = new Date(currentExam[0].startsFrom);
      var examStartTime = new Date();
      examStartTime.setHours(
        examTime.getHours(),
        examTime.getMinutes(),
        examTime.getSeconds(),
        examTime.getMilliseconds()
      );
      var dif = (examStartTime.getTime() - new Date().getTime()) / 1000;
      time.setSeconds(time.getSeconds() + dif);
      console.log(currentExam[0].examId);
      setExamStatus("wait");
      // getQuestionsforExam(currentExam[0].examId);
    }
  }, [currentExam]);

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
          examId: currentExam[0].examId,
          regNo: auth.registrationNo,
          questionNo: key.split("_").pop(),
          ans: value,
        });
      }
    });

    if (myAns.length === 0) {
      myAns.push({
        examId: currentExam[0].examId,
        regNo: auth.registrationNo,
        questionNo: 0,
        ans: "",
      });
    }
    console.log(myAns);
    await fetch("http://localhost:5000/results/add", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: myAns }),
    })
      .then((response) => response.json())
      .then(() => {
        fetch("http://localhost:5000/examAccess/editWrittenStatus", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examId: currentExam[0].examId,
            regNo: auth.registrationNo,
            writtenStatus: 1,
          }),
        })
          .then((response) => response.json())
          .then(() => {
            navigate(-1);
          });
      });
  };

  const handleExpireTimer = () => {
    setExamStatus("start");
    var endDt = new Date(currentExam[0].endTo);
    var examEndTime = new Date();
    examEndTime.setHours(
      endDt.getHours(),
      endDt.getMinutes(),
      endDt.getSeconds(),
      endDt.getMilliseconds()
    );
    var dif = (examEndTime.getTime() - new Date().getTime()) / 1000;
    if (getQuestionsforExam(currentExam[0].examId)) {
      return dif;
    }
  };

  const handleFormSubmit = () => {
    inputSubmit.current.click();
  };
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Toolbar sx={{ mt: 15 }}>
          {currentExam.length > 0 ? (
            <MyTimer
              expiryTimestamp={time}
              onExpire={handleExpireTimer}
              examStatus={examStatus}
              onTimerSubmit={handleFormSubmit}
            />
          ) : (
            <Container>
              <Typography variant="h4" align="center">
                You Don't have an exam today
              </Typography>
              <Grid container justifyContent="center">
                <Button
                  variant="contained"
                  type="button"
                  component={RouterLink}
                  to="/practiceExamList"
                  size="large"
                  color="secondary"
                  endIcon={<SendIcon />}
                >
                  Goto List
                </Button>
              </Grid>
            </Container>
          )}
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
  );
}
