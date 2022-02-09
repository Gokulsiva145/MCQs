// import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  // Autocomplete,
  Avatar,
  Box,
  Button,
  // Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
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
import LockIcon from "@mui/icons-material/Lock";
import moment from "moment";
import Swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const StudentLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email address is required"),
  birthDate: Yup.date()
    .required("Date of birth is required")
    .transform((value) => {
      return value ? moment(value).toDate() : value;
    })
    .max(new Date(), "Future date not allowed")
    .min(8, "Invaild Format"),
  examType: Yup.string().required("Exam Type is required"),
});

const theme = createTheme();

export default function LoginStudent() {
  const navigate = useNavigate();
  const examTypes = [
    { id: "0", label: "Exam" },
    { id: "1", label: "Practice" },
  ];
  const initValues = {
    email: "",
    birthDate: "",
    examType: "0",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      console.log(values);
      fetch(
        `http://localhost:5000/students/filtered?email=${
          values.email
        }&birthDate=${moment(values.birthDate).format("DD-MM-YYYY")}`
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.length === 0) {
            Swal.fire({
              icon: "error",
              title: "Email or Date of Birth is incorrect!",
              toast: true,
              position: "top-right",
              timer: 2000,
            });
            setSubmitting(false);
          } else if (result[0].status_Code === 0) {
            Swal.fire({
              icon: "warning",
              title: "You are not an Active Student!",
              toast: true,
              position: "top-right",
            }).then(() => setSubmitting(false));
          } else {
            if (values.examType === "0") {
              navigate("/examPaper", { state: { data: result[0] } });
            } else {
              navigate("/practiceExamList",{ state: { data: result[0] } });
            }
          }
        });
    }, 500);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Student Login
            </Typography>
            <Formik
              enableReinitialize
              initialValues={initValues}
              validationSchema={StudentLoginSchema}
              validateOnBlur={false}
              onSubmit={handleSubmit}
            >
              {({
                values,
                touched,
                errors,
                isSubmitting,
                status,
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
                            errors.birthDate && touched.birthDate ? true : false
                          }
                          helperText={errors.birthDate}
                          margin="normal"
                          fullWidth
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <FormControl
                    component="fieldset"
                    style={{ textAlign: "left", display: "block" }}
                  >
                    <FormLabel component="legend">Exam Type</FormLabel>
                    <RadioGroup
                      row
                      aria-label="level"
                      name="row-radio-buttons-group"
                    >
                      {examTypes.map((option) => (
                        <FormControlLabel
                          name="examType"
                          key={option.id}
                          value={option.id}
                          control={
                            <Radio
                              onChange={handleChange}
                              checked={values.examType === option.id}
                            />
                          }
                          label={option.label}
                        />
                      ))}
                      <FormHelperText
                        name="examType"
                        component="div"
                        className="Mui-error"
                        style={{ textAlign: "center" }}
                      >
                        {errors.examType}
                      </FormHelperText>
                    </RadioGroup>
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
                  <Grid container />
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
