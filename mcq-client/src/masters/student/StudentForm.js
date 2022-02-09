import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sentenceCase } from "change-case";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CardHeader,
  CardContent,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Swal from "sweetalert2";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email address is required"),
  name: Yup.string().required("Name is required"),
  registrationNo: Yup.string().required("Registration number is required"),
  birthDate: Yup.date()
    .required("Date of birth is required")
    .transform((value) => {
      return value ? moment(value).toDate() : value;
    })
    .max(new Date(), "Future date not allowed"),
  course: Yup.object({
    courseCode: Yup.string().required("Course is required"),
  }),
  institution: Yup.string().required("Institution is required"),
});

const theme = createTheme();

export default function StudentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [image, _setImage] = useState(null);
  const [imageURL, _setImageURL] = useState(null);
  const [currentForm, setCurrentForm] = useState("add");

  const initValues =
    location.state == null
      ? {
          registrationNo: "",
          name: "",
          birthDate: "",
          email: "",
          course: {
            courseCode: "",
            groupName: "select course",
          },
          institution: "",
          avatarUrl: "",
          statusCode: 0,
        }
      : {
          registrationNo: location.state.data.registrationNo,
          name: location.state.data.name,
          birthDate: location.state.data.birthDate,
          email: location.state.data.email,
          course: {
            courseCode: location.state.data.courseCode,
            groupName: location.state.data.groupName,
          },
          institution: location.state.data.institution,
          avatarUrl: location.state.data.avatarUrl,
          statusCode: location.state.data.statusCode,
        };

  const getCourses = async () => {
    const result = await fetch("http://localhost:5000/courses/all");
    const record = await result.json();
    record.unshift({
      courseCode: "",
      groupName: "select course",
    });
    setCourses(record);
  };

  useEffect(() => {
    getCourses();
    if (location.state === null) {
      setCurrentForm("add");
    } else {
      setCurrentForm("update");
    }
  }, []);

  const cleanup = () => {
    URL.revokeObjectURL(image);
  };

  const setImage = (newImageURL) => {
    if (image) {
      cleanup();
    }
    _setImageURL(newImageURL);
  };

  const handleOnChangeImage = (event) => {
    const newImage = event.target?.files?.[0];
    _setImage(newImage);
    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
  };

  const handleSubmit = async (values, { setStatus, setSubmitting }) => {
    setStatus();
    let avatarUrl = null;

    if (image !== null) {
      const data = new FormData();
      var newFileName =
        values.registrationNo + "." + image.name.split(".").pop();

      data.append("file", image, newFileName);

      //   console.log(data.get("file"));
      await fetch("http://localhost:5000/students/uploadFiles", {
        method: "Post",
        body: data,
      })
        .then((response) => response.json())
        .then((responseData) => {
          //   console.log(responseData);
          avatarUrl = `http://localhost:5000/images/students/${newFileName}`;
        });
    }

    setTimeout(() => {
      console.log(values);
      let postURL = "";
      if (currentForm === "add") {
        postURL = "http://localhost:5000/students/add";
      } else {
        postURL = "http://localhost:5000/students/edit";
      }
      fetch(postURL, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regNo: values.registrationNo,
          name: values.name,
          dob: values.birthDate,
          email: values.email,
          course: values.course.courseCode,
          institution: values.institution,
          avatarUrl: avatarUrl === null ? values.avatarUrl : avatarUrl,
          statusCode: values.statusCode,
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
                navigate(-1);
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

  return (
    <ThemeProvider theme={theme}>
      <Grid>
        <CssBaseline />
        <Grid component={Paper} elevation={6} square>
          <Box
            sx={{
              mx: 5,
              display: "flex",
              flexDirection: "column",
              //   alignItems: "center",
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  alt={initValues.name}
                  src={initValues.avatarUrl}
                  sx={{ bgcolor: "secondary.main" }}
                />
              }
              title={
                <Typography align="left" component="div" variant="h6">
                  {sentenceCase(currentForm)} Student
                </Typography>
              }
              action={
                <Button type="button"  variant="outlined" sx={{mr:1}} onClick={()=>navigate(-1)}>Back</Button>
              }
            />
            <CardContent>
              <Formik
                enableReinitialize
                initialValues={initValues}
                validationSchema={RegistrationSchema}
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
                    sx={{ mt: 1 }}
                  >
                    <Grid container spacing={0} justifyContent="center">
                      <Grid item lg={3}>
                        <input
                          accept="image/*"
                          id="icon-button-file"
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleOnChangeImage}
                        />
                        <label htmlFor="icon-button-file">
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            sx={{ mt: 2 }}
                          >
                            {/* <PhotoCamera /> */}
                            <Avatar
                              sx={{ height: "200px", width: "200px" }}
                              //   src={URL.createObjectURL(values.avatarUrl)}
                              //   src={values.avatarUrl}
                              src={imageURL || values.avatarUrl}
                            />
                          </IconButton>
                        </label>
                      </Grid>
                      <Grid item lg={9} xs={12}>
                        <TextField
                          name="registrationNo"
                          label="Registration Number"
                          value={values.registrationNo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            errors.registrationNo && touched.registrationNo
                          }
                          helperText={errors.registrationNo}
                          margin="normal"
                          fullWidth
                          disabled={currentForm === "update"}
                        />
                        <TextField
                          name="name"
                          label="Student Name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.name && touched.name}
                          helperText={errors.name}
                          margin="normal"
                          fullWidth
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date of Birth"
                            name="birthDate"
                            inputFormat="dd/MM/yyyy"
                            value={values.birthDate}
                            onChange={(newDate) => {
                              setFieldValue("birthDate", newDate);
                            }}
                            onBlur={(newDate) => {
                              setFieldValue("birthDate", new Date(newDate));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  errors.birthDate && touched.birthDate
                                    ? true
                                    : false
                                }
                                helperText={errors.birthDate}
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          name="course.courseCode"
                          options={courses}
                          getOptionLabel={(option) => {
                            if (option.hasOwnProperty("groupName")) {
                              return option.groupName;
                            }
                            return option;
                          }}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              key={option.courseCode}
                              {...props}
                            >
                              {option.groupName}
                            </Box>
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.courseCode === values.course.courseCode
                          }
                          renderInput={(params) => (
                            <>
                              <TextField
                                {...params}
                                name="course.courseCode"
                                label="Course"
                                margin="normal"
                                error={
                                  errors.course && touched.course ? true : false
                                }
                                helperText={
                                  errors.course && touched.course
                                    ? errors.course.courseCode
                                    : false
                                }
                                sx={{ mb: 0 }}
                              />
                            </>
                          )}
                          value={values.course}
                          onChange={(e, value) => {
                            console.log(value);
                            setFieldValue("course", {
                              courseCode: value.courseCode,
                              groupName: value.groupName,
                            });
                          }}
                          onBlur={() => {
                            if (values.course === null) {
                              setFieldValue("course", initValues.course);
                            }
                          }}
                          fullWidth
                        />
                        <TextField
                          name="institution"
                          label="Institution"
                          value={values.institution}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.institution && touched.institution}
                          helperText={errors.institution}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          name="email"
                          label="Email Address"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.email && touched.email}
                          helperText={errors.email}
                          margin="normal"
                          fullWidth
                        />
                        <FormControl
                          component="fieldset"
                          style={{ textAlign: "left", display: "block" }}
                        >
                          <FormLabel component="legend">Level</FormLabel>
                          <RadioGroup
                            row
                            aria-label="level"
                            name="row-radio-buttons-group"
                          >
                            <FormControlLabel
                              value={1}
                              control={
                                <Radio
                                  onChange={(e) => {
                                    setFieldValue("statusCode", e.target.value);
                                  }}
                                  checked={parseInt(values.statusCode) === 1}
                                />
                              }
                              label="Active"
                            />
                            <FormControlLabel
                              value={0}
                              control={
                                <Radio
                                  onChange={(e) => {
                                    setFieldValue("statusCode", e.target.value);
                                  }}
                                  checked={parseInt(values.statusCode) === 0}
                                />
                              }
                              label="Inctive"
                            />
                          </RadioGroup>
                        </FormControl>
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
                    </Grid>
                    <Grid container />
                  </Box>
                )}
              </Formik>
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
