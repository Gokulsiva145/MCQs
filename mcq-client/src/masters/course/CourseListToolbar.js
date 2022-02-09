import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import Swal from "sweetalert2";
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

CourseListToolbar.propTypes = {
  numSelected: PropTypes.number,
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteSelected: PropTypes.func,
};

export default function CourseListToolbar({
  numSelected,
  selected,
  filterName,
  onFilterName,
  onDeleteSelected,
}) {
  const handleDeleteSelected = async (selecteds) => {
    await Swal.fire({
      title: "Are you sure to Delete the Selected Courses ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes, Delete it",
      denyButtonText: `No`,
    }).then( async (result) => {
      if (result.isConfirmed) {
        await fetch("http://localhost:5000/courses/remove", {
          method: "delete",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseCodes: selecteds,
          }),
        }).then(() => {
          onDeleteSelected();
          Swal.fire("Deleted!", "", "success");
        });
      } else if (result.isDenied) {
        Swal.fire("Courses deletion was cancelled", "", "info");
      }
    });
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
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: "text.disabled" }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDeleteSelected(selected)}>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
