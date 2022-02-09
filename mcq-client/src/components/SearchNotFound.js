import PropTypes from "prop-types";
// material
import { Paper, Typography } from "@mui/material";

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = "", ...other }) {
  return (
    <Paper {...other}>
      {searchQuery === "" ? (
        <Typography gutterBottom align="center" variant="subtitle1">
          No Data found
        </Typography>
      ) : (
        <>
          <Typography
            gutterBottom
            align="center"
            variant="subtitle1"
            color="red"
          >
            Not found
          </Typography>
          <Typography variant="body2" align="center">
            No results found for &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos
            or using complete words.
          </Typography>
        </>
      )}
    </Paper>
  );
}
