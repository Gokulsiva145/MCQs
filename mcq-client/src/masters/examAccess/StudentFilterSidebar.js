import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { Form, FormikProvider } from "formik";
import closeFill from "@iconify/icons-eva/close-fill";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import funnelOutline from "@iconify/icons-eva/funnel-outline";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
// material
import {
  Autocomplete,
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  //   Rating,
  Divider,
  //   Checkbox,
  FormGroup,
  Grid,
  IconButton,
  Typography,
  RadioGroup,
  TextField,
  FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Scrollbar from "../../components/Scrollbar";
// ----------------------------------------------------------------------

export const FILTER_STATUS_OPTIONS = [
  { value: 0, label: "Inactive" },
  { value: 1, label: "Active" },
];

// ----------------------------------------------------------------------

StudentFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onSubmitFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
};

export default function StudentFilterSidebar({
  isOpenFilter,
  onResetFilter,
  onSubmitFilter,
  onOpenFilter,
  onCloseFilter,
  formik,
}) {
  const {
    values,
    getFieldProps,
    // handleChange
  } = formik;
  const [courses, setCourses] = useState([]);
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
  }, []);
  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Icon icon={roundFilterList} />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: "none", overflow: "hidden" },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                Filters
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Course
                  </Typography>
                  <FormGroup>
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
                        <Box component="li" key={option.courseCode} {...props}>
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
                            sx={{ mb: 0 }}
                          />
                        </>
                      )}
                      value={values.course}
                      //   onChange={(handleChange)}
                      onChange={(e, value) => {
                        if (value === null) {
                          formik.setFieldValue("course", {
                            courseCode: "",
                            groupName: "select course",
                          });
                        } else {
                          formik.setFieldValue("course", {
                            courseCode: value.courseCode,
                            groupName: value.groupName,
                          });
                        }
                      }}
                      fullWidth
                    />
                  </FormGroup>
                </div>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Status
                  </Typography>
                  <RadioGroup {...getFieldProps("activeStatus")}>
                    {FILTER_STATUS_OPTIONS.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                </div>
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    color="inherit"
                    variant="outlined"
                    onClick={onSubmitFilter}
                    startIcon={<Icon icon={funnelOutline} />}
                  >
                    filter
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    color="inherit"
                    variant="outlined"
                    onClick={onResetFilter}
                    startIcon={<Icon icon={roundClearAll} />}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}
