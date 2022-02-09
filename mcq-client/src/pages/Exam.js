import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
// import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  Table,
  Stack,
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
import moment from "moment";
// components
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import { TableListHead, ExamListToolbar, ExamMoreMenu } from "../masters/exam";
import { getUserEmail } from "../utils/Common";
import { getComparator, applySortFilter } from "../utils/tableFunctions";
import FormDialog from "../masters/exam/Modal";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "examCode", label: "Exam Code", alignRight: false },
  { id: "subjectName", label: "Subject", alignRight: false },
  { id: "examDate", label: "Date", alignRight: false },
  { id: "startsFrom", label: "From", alignRight: false },
  { id: "endTo", label: "To", alignRight: false },
  { id: "passMark", label: "Pass Mark", alignRight: false },
  { id: "", label: "Action", alignRight: false },
];

// ----------------------------------------------------------------------

export default function Exam() {
  const [SCHEDULELIST, setSCHEDULELIST] = useState([]);
  const [modalData, setModalData] = useState({});
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("registrationNo");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getExams = async () => {
    const result = await fetch(
      `http://localhost:5000/schedules/${getUserEmail()}`
    );
    const record = await result.json();
    setSCHEDULELIST(record);
  };

  useEffect(() => {
    getExams();
  }, []);

  // ----Modal controls start---------

  const getData = () => {
    getExams();
    handleOpenModal(false);
  };

  const handleOpenModal = (value) => {
    setIsDialogOpen(value);
  };

  const handleChangeModalData = (data) => {
    setModalData(data);
  };
  // -----Modal controls end-------

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = SCHEDULELIST.map((n) => n.examCode);
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

  const handleDeleteSelected = (event) => {
    getData();
    setSelected([]);
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Exam
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={() => {
              setModalData(null);
              handleOpenModal(true);
            }}
          >
            New Exam
          </Button>
        </Stack>

        <Card>
          <ExamListToolbar
           numSelected={selected.length}
           selected={selected}
           filterName={filterName}
           onFilterName={handleFilterByName}
           onDeleteSelected={handleDeleteSelected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={SCHEDULELIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredExams
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        examId,
                        examCode,
                        subjectName,
                        examDate,
                        startsFrom,
                        endTo,
                        passMark,
                      } = row;
                      const isItemSelected = selected.indexOf(examId) !== -1;

                      return (
                        <TableRow
                          hover
                          key={examId}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, examId)}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {examCode}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            {sentenceCase(subjectName)}
                          </TableCell>
                          <TableCell align="left">
                            {moment(examDate).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="left">
                            {moment(startsFrom).format("hh:mm:ss A")}
                          </TableCell>
                          <TableCell align="left">
                            {moment(endTo).format("hh:mm:ss A")}
                          </TableCell>
                          <TableCell align="center">{passMark}</TableCell>
                          <TableCell align="center">
                            <ExamMoreMenu
                              data={row}
                              onChangeData={handleChangeModalData}
                              openModal={handleOpenModal}
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
        <FormDialog
          show={isDialogOpen}
          handleChangeDialogStatus={handleOpenModal}
          data={modalData}
          onAfterUpdate={getData}
        />
      </Container>
    </Page>
  );
}
