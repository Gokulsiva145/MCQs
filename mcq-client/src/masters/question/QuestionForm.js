import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sentenceCase } from "change-case";
import {
  Box,
  Button,
  Collapse,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import { Formik, Field } from "formik";
import * as Yup from "yup";

export default function QuestionForm(props) {
  // const inputEl = useRef();
  // const [checked, setChecked] = React.useState(props.show);
  const location = useLocation();
  const [initValues, setInitValues] = useState({});
  const [currentForm, setCurrentForm] = useState("add");
  const [questionTypes, setQuestionTypes] = useState([]);
  const [currentQuestionType, setCurrentQuestionType] = useState(1);
  const [currentQuestionOptions, setCurrentQuestionOptions] = useState({
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
  });

  useEffect(() => {
    if (props.data === null) {
      setInitValues({
        examId: location.state.examId,
        questionNo: "",
        question: "",
        questionType: currentQuestionType,
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: currentQuestionType === 2 ? [] : "",
        mark: 1,
        negativeMark: 0,
      });
      setCurrentForm("add");
    } else {
      let answer = props.data.correctAnswer;
      if (props.data.correctAnswer.indexOf("[|]") > -1) {
        answer = props.data.correctAnswer.split("[|]");
      }
      setInitValues({
        examId: location.state.examId,
        questionNo: props.data.questionNo,
        question: props.data.question,
        questionType: props.data.question_Type_Id,
        optionA: props.data.optionA,
        optionB: props.data.optionB,
        optionC: props.data.optionC,
        optionD: props.data.optionD,
        answer: answer,
        mark: props.data.mark,
        negativeMark: props.data.negativeMark,
      });
      setCurrentQuestionType(props.data.question_Type_Id);
      setCurrentQuestionOptions({
        optionA: props.data.optionA,
        optionB: props.data.optionB,
        optionC: props.data.optionC,
        optionD: props.data.optionD,
      });
      setCurrentForm("update");
    }
  }, [props.show]);

  const handleQuestionOptions = (name, value) => {
    setCurrentQuestionOptions({ ...currentQuestionOptions, [name]: value });
  };
  useEffect(() => {
    getQuestionTypes();
  }, []);

  let questionTypeControl =
    currentQuestionType === 2 ? <Checkbox /> : <Radio />;

  const getQuestionTypes = async () => {
    const record = await fetch(`http://localhost:5000/questions/types`);
    const result = await record.json();
    setQuestionTypes(result);
  };

  const handleSubmit = async (values, { setStatus, setSubmitting }) => {
    setStatus();

    setTimeout(() => {
      console.log(values);
      let postURL = "";
      if (currentForm === "add") {
        postURL = "http://localhost:5000/questions/add";
      } else {
        postURL = "http://localhost:5000/questions/edit";
      }

      fetch(postURL, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: values.examId,
          questionNo: values.questionNo,
          question: values.question,
          questionType: values.questionType,
          optionA: values.optionA,
          optionB: values.optionB,
          optionC: values.optionC,
          optionD: values.optionD,
          answer: Array.isArray(values.answer)
            ? values.answer.sort().join("[|]")
            : values.answer,
          mark: values.mark,
          negativeMark: values.negativeMark,
          oldQuestionNo: !!props.data ? props.data.questionNo : 0,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result[0] === 1) {
            Swal.fire({
              toast: true,
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1000,
            }).then((res) => {
              if (res) {
                // navigate(-1);
                props.onChangeShow(false);
                props.onAfterUpdate();
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
          // throw err;
        });
    }, 500);
  };

  const QuestionSchema = Yup.object().shape({
    questionNo: Yup.string().required("Question No is required"),
    question: Yup.string().required("Question is required"),
    optionA: Yup.string().required("Option 1 is required"),
    optionB: Yup.string().notRequired(),
    optionC: Yup.string().notRequired(),
    optionD: Yup.string().notRequired(),
    answer: Yup.lazy((val) =>
      Array.isArray(val)
        ? Yup.array()
            .of(
              Yup.string().oneOf([
                currentQuestionOptions.optionA,
                currentQuestionOptions.optionB,
                currentQuestionOptions.optionC,
                currentQuestionOptions.optionD,
              ])
            )
            .min(2, "Please choose atleast two option")
        : Yup.string()
            .required("Answer is Required. Please Choose option")
            .oneOf(
              [
                Yup.ref("optionA"),
                Yup.ref("optionB"),
                Yup.ref("optionC"),
                Yup.ref("optionD"),
              ],
              "The answer must match any one option"
            )
    ),
  });

  return (
    <Collapse in={props.show}>
      <Paper sx={{ m: 1 }} elevation={4} component="div">
        <Formik
          enableReinitialize
          initialValues={initValues}
          validationSchema={QuestionSchema}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, mx: 3 }}
            >
              {values.answer !== undefined && (
                <Grid container spacing={2} justifyContent="between">
                  <Grid item xs={12} lg={3}>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="qType">Question Type</InputLabel>
                      {questionTypes.length > 0 && (
                        <Select
                          labelId="qType"
                          name="questionType"
                          value={values.questionType}
                          label="Question Type"
                          onChange={(e) => {
                            setFieldValue("questionType", e.target.value);
                            //   setFieldValue("answer", "");
                            setCurrentQuestionType(e.target.value);
                          }}
                        >
                          {questionTypes.map((qtype) => (
                            <MenuItem
                              key={qtype.questionTypeId}
                              value={qtype.questionTypeId}
                            >
                              {qtype.questionType}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </FormControl>
                    <TextField
                      name="questionNo"
                      label="Question No"
                      InputLabelProps={{
                        shrink: values.questionNo !== "",
                      }}
                      value={values.questionNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.questionNo && touched.questionNo}
                      helperText={errors.questionNo}
                      margin="normal"
                      fullWidth
                      disabled={currentForm === "update"}
                    />
                  </Grid>
                  <Grid item xs={12} lg={9}>
                    <TextField
                      name="question"
                      label="Question"
                      InputLabelProps={{
                        shrink: values.question !== "",
                      }}
                      multiline
                      rows={4.15}
                      value={values.question}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.question && touched.question}
                      helperText={errors.question}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                  {/* <Grid item xs={12}> */}
                  <RadioGroup row aria-label="Correct Answer" sx={{ pl: 2 }}>
                    {/* <FormGroup row aria-label="Correct Answer"> */}
                    <Grid item xs={6}>
                      <TextField
                        name="optionA"
                        label="Option A"
                        InputLabelProps={{
                          shrink: values.optionA !== "",
                        }}
                        value={values.optionA}
                        onChange={(e) => {
                          setFieldValue("optionA", e.target.value);
                          handleQuestionOptions("optionA", e.target.value);
                          // setFieldValue("answer", "");
                        }}
                        // disabled={
                        //   // values.answer.includes(values.optionA) &&
                        //   // values.optionA !== ""
                        //   values.optionA.indexOf(values.optionA) > -1
                        // }
                        disabled={
                          (typeof values.answer === "object" &&
                            values.answer.some(function (el) {
                              return el === values.optionA;
                            })) ||
                          (typeof values.answer === "string" &&
                            values.optionA === values.answer &&
                            !!values.optionA &&
                            !!values.answer)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Field name="answer">
                                {({ field }) => (
                                  <FormControlLabel
                                    {...field}
                                    sx={{ m: 0, mr: -1 }}
                                    control={questionTypeControl}
                                    value={values.optionA}
                                    label=""
                                    checked={
                                      (typeof values.answer === "object" &&
                                        values.answer.some(function (el) {
                                          return el === values.optionA;
                                        })) ||
                                      (typeof values.answer === "string" &&
                                        values.optionA.match(values.answer) &&
                                        !!values.optionA &&
                                        !!values.answer)
                                    }
                                  />
                                )}
                              </Field>
                            </InputAdornment>
                          ),
                        }}
                        error={errors.optionA && touched.optionA}
                        helperText={errors.optionA}
                        sx={{ pr: 2 }}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="optionB"
                        label="Option B"
                        InputLabelProps={{
                          shrink: values.optionB !== "",
                        }}
                        value={values.optionB}
                        onChange={(e) => {
                          setFieldValue("optionB", e.target.value);
                          handleQuestionOptions("optionB", e.target.value);
                          // setFieldValue("answer", "");
                        }}
                        disabled={
                          (typeof values.answer === "object" &&
                            values.answer.some(function (el) {
                              return el === values.optionB;
                            })) ||
                          (typeof values.answer === "string" &&
                            values.optionB === values.answer &&
                            !!values.optionB &&
                            !!values.answer)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Field name="answer">
                                {({ field }) => (
                                  <FormControlLabel
                                    {...field}
                                    sx={{ m: 0, mr: -1 }}
                                    control={questionTypeControl}
                                    value={values.optionB}
                                    label=""
                                    checked={
                                      (typeof values.answer === "object" &&
                                        values.answer.some(function (el) {
                                          return el === values.optionB;
                                        })) ||
                                      (typeof values.answer === "string" &&
                                        values.optionB.match(values.answer) &&
                                        !!values.optionB &&
                                        !!values.answer)
                                    }
                                  />
                                )}
                              </Field>
                            </InputAdornment>
                          ),
                        }}
                        error={errors.optionB && touched.optionB}
                        helperText={errors.optionB}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="optionC"
                        label="Option C"
                        InputLabelProps={{
                          shrink: values.optionC !== "",
                        }}
                        value={values.optionC}
                        onChange={(e) => {
                          setFieldValue("optionC", e.target.value);
                          handleQuestionOptions("optionC", e.target.value);
                          // setFieldValue("answer", "");
                        }}
                        disabled={
                          (typeof values.answer === "object" &&
                            values.answer.some(function (el) {
                              return el === values.optionC;
                            })) ||
                          (typeof values.answer === "string" &&
                            values.optionC === values.answer &&
                            !!values.optionC &&
                            !!values.answer)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Field name="answer">
                                {({ field }) => (
                                  <FormControlLabel
                                    {...field}
                                    sx={{ m: 0, mr: -1 }}
                                    control={questionTypeControl}
                                    value={values.optionC}
                                    label=""
                                    checked={
                                      (typeof values.answer === "object" &&
                                        values.answer.some(function (el) {
                                          return el === values.optionC;
                                        })) ||
                                      (typeof values.answer === "string" &&
                                        values.optionC.match(values.answer) &&
                                        !!values.optionC &&
                                        !!values.answer)
                                    }
                                  />
                                )}
                              </Field>
                            </InputAdornment>
                          ),
                        }}
                        error={errors.optionC && touched.optionC}
                        helperText={errors.optionC}
                        sx={{ pr: 2 }}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="optionD"
                        label="Option D"
                        InputLabelProps={{
                          shrink: values.optionD !== "",
                        }}
                        value={values.optionD}
                        onChange={(e) => {
                          setFieldValue("optionD", e.target.value);
                          handleQuestionOptions("optionD", e.target.value);
                          // setFieldValue("answer", "");
                        }}
                        disabled={
                          (typeof values.answer === "object" &&
                            values.answer.some(function (el) {
                              return el === values.optionD;
                            })) ||
                          (typeof values.answer === "string" &&
                            values.optionD === values.answer &&
                            !!values.optionD &&
                            !!values.answer)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Field name="answer">
                                {({ field }) => (
                                  <FormControlLabel
                                    {...field}
                                    sx={{ m: 0, mr: -1 }}
                                    control={questionTypeControl}
                                    value={values.optionD}
                                    label=""
                                    checked={
                                      (typeof values.answer === "object" &&
                                        values.answer.some(function (el) {
                                          return el === values.optionD;
                                        })) ||
                                      (typeof values.answer === "string" &&
                                        values.optionD.match(values.answer) &&
                                        !!values.optionD &&
                                        !!values.answer)
                                    }
                                  />
                                )}
                              </Field>
                            </InputAdornment>
                          ),
                        }}
                        error={errors.optionD && touched.optionD}
                        helperText={errors.optionD}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    {/* </FormGroup> */}
                  </RadioGroup>
                  {/* </Grid> */}
                  <Grid item xs={6}>
                    <TextField
                      name="mark"
                      label="Mark"
                      value={values.mark}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.mark && touched.mark}
                      helperText={errors.mark}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="negativeMark"
                      label="Negative Mark"
                      value={values.negativeMark}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.negativeMark && touched.negativeMark}
                      helperText={errors.negativeMark}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="answer"
                      label="Answer"
                      InputLabelProps={{
                        shrink: values.answer !== "",
                      }}
                      variant="standard"
                      value={values.answer}
                      error={errors.answer && touched.answer}
                      helperText={errors.answer}
                      margin="normal"
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  {sentenceCase(currentForm)}
                </Button>
              </Grid>

              <Grid container />
            </Box>
          )}
        </Formik>
      </Paper>
    </Collapse>
  );
}
