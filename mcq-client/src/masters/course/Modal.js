import React, { useEffect, useState } from "react";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const CourseSchema = Yup.object().shape({
  courseCode: Yup.string().required("Course Code is required"),
  groupName: Yup.string().required("Course Name is required"),

});

export default function FormDialog(props) {
  const [initValues, setInitValues] = useState({});
  const [currentModal, setCurrentModal] = useState("add");

  useEffect(() => {
    console.log(props);
    if (props.data === null) {
      setInitValues({
        courseCode: "",
        groupName: "",
      });
      setCurrentModal("add");
    } else {
      setInitValues({
        courseCode: props.data.courseCode,
        groupName: props.data.groupName,
      });
      setCurrentModal("edit");
    }
  }, [props.show]);

  const handleClose = () => {
    props.handleChangeDialogStatus(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    var fetchUrl;
    if (currentModal === "add") {
      fetchUrl = "http://localhost:5000/courses/add";
    } else {
      fetchUrl = "http://localhost:5000/courses/edit";
    }
    await fetch(fetchUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseCode: values.courseCode,
        groupName: values.groupName,
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
        else {
          if (result.originalError.info.number === 2627) {
            handleClose();
            Swal.fire({
              icon: 'error',
              title: values.courseCode + ' is already exist!',
              text:  "Please try different Course Code",
              toast: true,
              showConfirmButton: false,
              timer: 2000,
              position: 'bottom-right'
            })
          } else {
            console.log(result);
          }
          setSubmitting(false);
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
          {currentModal === "add" ? "Add" : "Edit"} Course
        </DialogTitle>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={initValues}
            validationSchema={CourseSchema}
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
            }) => (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >                
                <TextField
                  name="courseCode"
                  label="Course Code"
                  value={values.courseCode}
                  onChange={handleChange}
                  error={errors.courseCode && touched.courseCode}
                  helperText={errors.courseCode}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  name="groupName"
                  label="subject Name"
                  value={values.groupName}
                  onChange={handleChange}
                  error={errors.groupName && touched.groupName}
                  helperText={errors.groupName}
                  margin="normal"
                  fullWidth
                />               
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color={currentModal === "add" ? "primary" : "secondary"}
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  {currentModal === "add" ? "Add" : "Update"}
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
