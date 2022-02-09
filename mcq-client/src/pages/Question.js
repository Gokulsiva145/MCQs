import { filter } from "lodash";
import { Icon } from "@iconify/react";
// import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import closeFill from "@iconify/icons-eva/close-fill";
// import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  Link,
  Table,
  Stack,
  //   Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
// import moment from "moment";
import { Link as RouterLink, useLocation } from "react-router-dom";

// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
  TableListHead,
  TableListToolbar,
  QuestionMoreMenu,
} from "../masters/question";
import QuestionForm from "../masters/question/QuestionForm";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "questionNo", label: "Q.No", alignRight: false },
  { id: "question", label: "Question", alignRight: false },
  { id: "optionA", label: "A", alignRight: false },
  { id: "optionB", label: "B", alignRight: false },
  { id: "optionC", label: "C", alignRight: false },
  { id: "optionD", label: "D", alignRight: false },
  { id: "mark", label: "Mark(+)", alignRight: false },
  { id: "negativeMark", label: "Mark(-)", alignRight: false },
  { id: "", label: "Action", alignRight: false },
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
      (_question) =>
        _question.questionNo
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1 ||
        _question.question.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _question.optionA.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _question.optionB.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _question.optionC.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _question.optionD.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _question.correctAnswer.toLowerCase().indexOf(query.toLowerCase()) !==
          -1 ||
        _question.mark.toString().toLowerCase().indexOf(query.toLowerCase()) !==
          -1 ||
        _question.negativeMark
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Question() {
  const location = useLocation();
  const [QUESTIONLIST, setQUESTIONLIST] = useState([]);
  const [formData, setFormData] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("registrationNo");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [questionFormShow, setQuestionFormShow] = useState(false);

  const getQuestions = async () => {
    const result = await fetch(
      `http://localhost:5000/questions/${location.state.examId}`
    );
    const record = await result.json();
    setQUESTIONLIST(record);
  };
  useEffect(() => {
    getQuestions();
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = QUESTIONLIST.map((n) => n.questionNo);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - QUESTIONLIST.length) : 0;

  const filteredQuestions = applySortFilter(
    QUESTIONLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isQuestionNotFound = filteredQuestions.length === 0;

  // --------question form controls-----
  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  const handleShowForm = (show) => {
    setQuestionFormShow(show);
    if (!show) {
      // console.log(location.state.examCode);
      setFormData(null);
      // setFormData({id:null,examCode:location.state.examCode});
    }
    scrollToTop();
  };
  const handleChangeFormData = (data) => {
    setFormData(data);
  };

  const handleOpenForm = (value) => {
    setQuestionFormShow(value);
  };
  const getData = () => {
    getQuestions();
    handleOpenForm(false);
  };

  return (
    <Page title="Question | Minimal-UI">
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
            / Questions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={questionFormShow ? closeFill : plusFill} />}
            onClick={() => {
              // handleChangeFormData({
              //   Id: null,
              //   examCode: location.state.examCode,
              // });
              handleShowForm(!questionFormShow);
            }}
          >
            Question
          </Button>
        </Stack>
        <QuestionForm
          show={questionFormShow}
          onChangeShow={handleShowForm}
          data={formData}
          onAfterUpdate={getData}
        />
        <Card>
          <TableListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={QUESTIONLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredQuestions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        questionNo,
                        question,
                        optionA,
                        optionB,
                        optionC,
                        optionD,
                        correctAnswer,
                        mark,
                        negativeMark,
                      } = row;
                      const isItemSelected =
                        selected.indexOf(questionNo) !== -1;

                      return (
                        <TableRow
                          hover
                          key={questionNo}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) =>
                                handleClick(event, questionNo)
                              }
                            />
                          </TableCell>
                          <TableCell align="left">{questionNo}</TableCell>
                          <TableCell align="left">{question}</TableCell>
                          <TableCell align="left">
                            {correctAnswer
                              .toString()
                              .toLowerCase()
                              .includes(optionA.toString().toLowerCase()) ? (
                              <Typography variant="subtitle2" noWrap>
                                {optionA}
                              </Typography>
                            ) : (
                              optionA
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {correctAnswer
                              .toString()
                              .toLowerCase()
                              .includes(optionB.toString().toLowerCase()) ? (
                              <Typography variant="subtitle2" noWrap>
                                {optionB}
                              </Typography>
                            ) : (
                              optionB
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {correctAnswer
                              .toString()
                              .toLowerCase()
                              .includes(optionC.toString().toLowerCase()) ? (
                              <Typography variant="subtitle2" noWrap>
                                {optionC}
                              </Typography>
                            ) : (
                              optionC
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {correctAnswer
                              .toString()
                              .toLowerCase()
                              .includes(optionD.toString().toLowerCase()) ? (
                              <Typography variant="subtitle2" noWrap>
                                {optionD}
                              </Typography>
                            ) : (
                              optionD
                            )}
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="success">
                              {mark}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="error">
                              {negativeMark}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            {/* <QuestionMoreMenu /> */}
                            <QuestionMoreMenu
                              data={row}
                              onChangeData={handleChangeFormData}
                              openForm={handleOpenForm}
                              onAfterDelete={getData}
                            />
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
                {isQuestionNotFound && (
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
            count={QUESTIONLIST.length}
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
