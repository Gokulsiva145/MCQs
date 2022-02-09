import React, { useEffect, useState } from "react";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getUserEmail } from "../../utils/Common";

const ScheduleSchema = Yup.object().shape({
  examDate: Yup.date().required("Date of exam is required"),
  // .min(new Date(), "Past date not allowed"),
  startsFrom: Yup.string().required("Time from is required"),
  endTo: Yup.string().required("Time to is required"),
  subject: Yup.object({
    subjectCode: Yup.string().required("Subject is required"),
  }),
  passMark: Yup.number().required("Pass mark is required"),
});

export default function FormDialog(props) {
  const [subjects, setSubjects] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [currentModal, setCurrentModal] = useState("addExam");

  const subjectWithOutData = {
    subjectCode: "",
    subjectName: "Select Subject -",
  };

  useEffect(() => {
    console.log(props);
    if (props.data === null) {
      setInitValues({
        subject: subjectWithOutData,
        examDate: new Date(),
        startsFrom: new Date().setHours(10, 0, 0, 0),
        endTo: new Date().setHours(12, 0, 0, 0),
        passMark: 0,
        examType: 0,
      });
      setCurrentModal("addExam");
    } else {
      setInitValues({
        examId: props.data.examId,
        examCode: props.data.examCode,
        subject: {
          subjectCode: props.data.subjectCode,
          subjectName: props.data.subjectName,
        },
        examDate: props.data.examDate,
        startsFrom: props.data.startsFrom,
        endTo: props.data.endTo,
        passMark: props.data.passMark,
        examType: props.data.examType,
      });
      setCurrentModal("editExam");
    }
  }, [props.show]);

  const getSubjects = async () => {
    const result = await fetch("http://localhost:5000/subjects/all");
    const record = await result.json();
    record.unshift(subjectWithOutData);
    setSubjects(record);
  };
  useEffect(() => getSubjects(), []);
  const handleClose = () => {
    props.handleChangeDialogStatus(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    var fetchUrl;
    if (currentModal === "addExam") {
      fetchUrl = "http://localhost:5000/schedules/add";
    } else {
      fetchUrl = "http://localhost:5000/schedules/edit";
    }
    await fetch(fetchUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examId: values.examId,
        examCode: `${values.subject.subjectCode}_${moment(
          values.examDate
        ).format("DDMMYY")}_${new Date(
          values.startsFrom
        ).getHours()}-${new Date(
          values.endTo
        ).getHours()}_${new Date().getTime()}`,
        subjectCode: values.subject.subjectCode,
        examDate: new Date(values.examDate),
        startsFrom: new Date(values.startsFrom),
        endTo: new Date(values.endTo),
        passMark: values.passMark,
        examType: values.examType,
        createdBy: getUserEmail(),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result[0] === 1) {
          props.onAfterUpdate();
          Swal.fire({
            toast: true,
            icon: "success",
            title: "Your work has been Updated",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        // throw err;
      });
  };
  return (
    <div>
      <Dialog open={props.show} onClose={handleClose}>
        <DialogTitle>
          {currentModal === "addExam" ? "Add" : "Edit"} Schedule
        </DialogTitle>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={initValues}
            validationSchema={ScheduleSchema}
            validateOnBlur={false}
            onSubmit={handleSubmit}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              isSubmitting,
              handleSubmit,
              setFieldValue,
            }) => (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <Autocomplete
                  name="subject.subjectCode"
                  options={subjects}
                  getOptionLabel={(option) => {
                    if (option.hasOwnProperty("subjectCode")) {
                      return `${option.subjectCode} - ${option.subjectName}`;
                    }
                    return option;
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" key={option.subjectCode} {...props}>
                      {option.subjectCode} {option.subjectName}
                    </Box>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.subjectCode === ""
                  }
                  renderInput={(params) => (
                    <>
                      <TextField
                        {...params}
                        name="subject.subjectCode"
                        label="Subject"
                        margin="normal"
                        error={Boolean(errors.subject && touched.subject)}
                        helperText={
                          errors.subject && touched.subject
                            ? errors.subject.subjectCode
                            : false
                        }
                        sx={{ mb: 0 }}
                      />
                    </>
                  )}
                  value={values.subject}
                  onChange={(e, value) => {
                    setFieldValue("subject", value);
                  }}
                  onBlur={() => {
                    if (values.subject === null) {
                      setFieldValue("subject", subjectWithOutData);
                    }
                  }}
                  fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Exam"
                    name="examDate"
                    inputFormat="dd/MM/yyyy"
                    value={values.examDate}
                    onChange={(newDate) => {
                      setFieldValue("examDate", newDate);
                    }}
                    onBlur={(newDate) => {
                      setFieldValue("examDate", new Date(newDate));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(errors.examDate && touched.examDate)}
                        helperText={errors.examDate}
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                  <TimePicker
                    name="startsFrom"
                    label="From"
                    value={values.startsFrom}
                    onChange={(newTime) => {
                      setFieldValue("startsFrom", newTime);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(errors.startsFrom && touched.startsFrom)}
                        helperText={errors.startsFrom}
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                  <TimePicker
                    name="endTo"
                    label="To"
                    value={values.endTo}
                    onChange={(newTime) => {
                      setFieldValue("endTo", newTime);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(errors.endTo && touched.endTo)}
                        helperText={errors.endTo}
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  name="passMark"
                  label="Pass Mark"
                  value={values.passMark}
                  onChange={handleChange}
                  error={errors.passMark && touched.passMark}
                  helperText={errors.passMark}
                  margin="normal"
                  fullWidth
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="examTypeLabel">Exam Type</InputLabel>
                  <Select
                    labelId="examTypeLabel"
                    name="examType"
                    value={values.examType}
                    label="Exam Type"
                    onChange={handleChange}
                  >
                    <MenuItem value={0}>Main</MenuItem>
                    <MenuItem value={1}>Practice</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color={currentModal === "addExam" ? "primary" : "secondary"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {currentModal === "addExam" ? "Add" : "Update"}
                </Button>
                <Grid container />
              </Box>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
