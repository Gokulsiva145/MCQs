import React, { useEffect, useState, useRef } from "react";
import { useTimer } from "react-timer-hook";
import moment from "moment";
import {
  Avatar,
  AppBar,
  Box,
  Button,
  Container,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Toolbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";

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

export default function ExamPaper(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [auth] = useState(location.state.data);
  const [time] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentExam, setCurrentExam] = useState([]);
  const [examStatus, setExamStatus] = useState("wait");
  const [questions, setQuestions] = useState([]);

  const inputSubmit = useRef(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        myAns[updateAnsIndex].ans=current.sort().join("[|]");
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
    
    if(myAns.length===0){
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
      <HideOnScroll {...props}>
        <AppBar color="" sx={{ p: 1 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            {!!auth && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    alt={auth.name}
                    src={auth.avatarUrl}
                    sx={{ bgcolor: "secondary.main" }}
                  />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>{auth.email}</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
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
  );
}
