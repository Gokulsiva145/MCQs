import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
// material
import {
  Card,
  Link,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Label from "../components/Label";
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
  ExamResultListHead,
  ExamResultListToolbar,
} from "../masters/examResult";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "student_Regno", label: "RegNo", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "groupName", label: "Course", alignRight: false },
  { id: "noOfQuestions", label: "No.questions", alignRight: false },
  { id: "maximumMarks", label: "Max Marks", alignRight: false },
  { id: "positiveMarks", label: "Marks(+)", alignRight: false },
  { id: "negativeMarks", label: "Marks(-)", alignRight: false },
  { id: "marksReceived", label: "Marks Received", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_result) =>
        _result.student_RegNo.toLowerCase().indexOf(query.toLowerCase()) !==
          -1 ||
        _result.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _result.groupName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ExamResult() {
  const location = useLocation();
  const [examId] = useState(location.state.examId);
  const [RESULTLIST, setRESULTLIST] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("student_RegNo");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getResults = async () => {
    const result = await fetch(`http://localhost:5000/results/${examId}`);
    const record = await result.json();
    setRESULTLIST(record);
  };

  useEffect(() => {
    getResults();
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - RESULTLIST.length) : 0;

  const filteredExams = applySortFilter(
    RESULTLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isExamNotFound = filteredExams.length === 0;

  return (
    <Page title="Exam Result">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            <Link underline="none" variant="h4" component={RouterLink} to={-1}>
              {location.state.examCode}{" "}
            </Link>
            / Result
          </Typography>
        </Stack>

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
                  rowCount={RESULTLIST.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredExams
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        student_RegNo,
                        name,
                        groupName,
                        noOfQuestions,
                        maximumMarks,
                        positiveMarks,
                        negativeMarks,
                        marksReceived,
                      } = row;

                      return (
                        <TableRow hover key={student_RegNo} tabIndex={-1}>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {student_RegNo}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            {sentenceCase(name)}
                          </TableCell>
                          <TableCell align="left">{groupName}</TableCell>
                          <TableCell align="center">{noOfQuestions}</TableCell>
                          <TableCell align="center">{maximumMarks}</TableCell>
                          <TableCell align="center">{positiveMarks}</TableCell>
                          <TableCell align="center">{negativeMarks}</TableCell>
                          <TableCell align="center">{marksReceived}</TableCell>
                          <TableCell align="center">
                            <Label
                              variant="ghost"
                              color={
                                (marksReceived >= location.state.passMark &&
                                  "success") ||
                                "error"
                              }
                            >
                              {sentenceCase(
                                marksReceived >= location.state.passMark
                                  ? "PASS"
                                  : "FAIL"
                              )}
                            </Label>
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
            count={RESULTLIST.length}
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
