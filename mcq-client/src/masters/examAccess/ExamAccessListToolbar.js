import PropTypes from "prop-types";
// material
import { styled } from "@mui/material/styles";
import { Toolbar, Typography, Stack } from "@mui/material";

import { default as StudentFilterSidebar } from "./StudentFilterSidebar";

import { useFormik } from "formik";
import { useState } from "react";
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

ExamAccessListToolbar.propTypes = {
  numSelected: PropTypes.number,
  selected: PropTypes.array,
  multipleFilterValue: PropTypes.func,
  onMultiFilter: PropTypes.func,
};

export default function ExamAccessListToolbar({
  numSelected,
  multipleFilterValue,
}) {
  const [openFilter, setOpenFilter] = useState(false);

  const formik = useFormik({
    initialValues: {
      course: {
        courseCode: "",
        groupName: "select course",
      },
      activeStatus: "",
    },
    onSubmit: (values) => {
      multipleFilterValue(values);
      setOpenFilter(false);
    },
  });

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    handleSubmit();
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    resetForm();
    handleSubmit();
  };

  const handleSubmitFilter = () => {
    handleSubmit();
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      <Typography component="div" variant="subtitle1">
        {numSelected === 0
          ? "Please Select Students to access this exam "
          : numSelected === 1
          ? "Only one Student can access this exam"
          : numSelected + " Students can access this exam"}
      </Typography>
      <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
        <StudentFilterSidebar
          formik={formik}
          isOpenFilter={openFilter}
          onResetFilter={handleResetFilter}
          onSubmitFilter={handleSubmitFilter}
          onOpenFilter={handleOpenFilter}
          onCloseFilter={handleCloseFilter}
        />
      </Stack>
    </RootStyle>
  );
}
