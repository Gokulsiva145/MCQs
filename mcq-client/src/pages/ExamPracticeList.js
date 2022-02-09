import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import moment from "moment";
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
  ExamResultListHead,
  ExamResultListToolbar,
} from "../masters/examResult";
import { getComparator, applySortFilter } from "../utils/tableFunctions";
import { Link as RouterLink, useLocation } from "react-router-dom";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "sno", label: "Serial No", alignRight: false },
  { id: "examCode", label: "Exam Code", alignRight: false },
  { id: "subjectName", label: "Subject", alignRight: false },
  { id: "time", label: "Time", alignRight: false },
  { id: "passMark", label: "Pass Mark", alignRight: false },
  { id: "", label: "Action", alignRight: false },
];

// ----------------------------------------------------------------------
function getDuration(d1, d2) {
  var startTime = moment(new Date(d1));
  var endTime = moment(new Date(d2));

  // calculate total duration
  var duration = moment.duration(endTime.diff(startTime));

  // duration in hours
  var hours = parseInt(duration.asHours());

  // duration in minutes
  var minutes = parseInt(duration.asMinutes()) % 60;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":00"
  );
}

export default function ExamPracticeList() {
  const location = useLocation();
  const [SCHEDULELIST, setSCHEDULELIST] = useState([]);
  const [currentUser] = useState(location.state.data);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("registrationNo");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getExams = async () => {
    const result = await fetch(
      "http://localhost:5000/schedules/filter?examType=1"
    );
    const record = await result.json();
    setSCHEDULELIST(record);
  };

  useEffect(() => {
    getExams();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - SCHEDULELIST.length) : 0;

  const filteredExams = applySortFilter(
    SCHEDULELIST,
    getComparator(order, orderBy),
    filterName
  );

  const isExamNotFound = filteredExams.length === 0;

  return (
    <Page title="Exam | Minimal-UI">
      <Container>
        <Stack mb={15}></Stack>
        <Card>
          <ExamResultListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ExamResultListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={SCHEDULELIST.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredExams
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        examId,
                        examCode,
                        subjectName,
                        startsFrom,
                        endTo,
                        passMark,
                      } = row;

                      return (
                        <TableRow hover key={examId} tabIndex={-1}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {examCode}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {sentenceCase(subjectName)}
                          </TableCell>
                          <TableCell align="left">
                            {/* {duration(startsFrom, endTo).hours}:
                            {duration(startsFrom, endTo).minutes}:
                            {duration(startsFrom, endTo).seconds} */}
                            {getDuration(startsFrom, endTo)}
                          </TableCell>
                          <TableCell align="left">{passMark}</TableCell>
                          <TableCell align="left">
                            <Button
                              variant="outlined"
                              color="error"
                              component={RouterLink}
                              to="/practiceExamPaper"
                              state={{ examData: row, userData: currentUser }}
                            >
                              Go
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isExamNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={SCHEDULELIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
