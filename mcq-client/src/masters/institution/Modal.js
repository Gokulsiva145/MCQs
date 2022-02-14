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
  institutionName: Yup.string().required("Institution Name is required"),

});

export default function FormDialog(props) {
  const [initValues, setInitValues] = useState({});
  const [currentModal, setCurrentModal] = useState("add");

  useEffect(() => {
    console.log(props);
    if (props.data === null) {
      setInitValues({
        institutionId: "",
        institutionName: "",
      });
      setCurrentModal("add");
    } else {
      setInitValues({
        institutionId: props.data.institutionId,
        institutionName: props.data.institutionName,
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
      fetchUrl = "http://localhost:5000/institutions/add";
    } else {
      fetchUrl = "http://localhost:5000/institutions/edit";
    }
    await fetch(fetchUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        institutionId: values.institutionId,
        institutionName: values.institutionName,
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
              title: values.institutionName + ' is already exist!',
              text:  "Please try different Institution Code",
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
          {currentModal === "add" ? "Add" : "Edit"} Institution
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
                  name="institutionName"
                  label="Institution"
                  value={values.institutionName}
                  onChange={handleChange}
                  error={errors.institutionName && touched.institutionName}
                  helperText={errors.institutionName}
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
