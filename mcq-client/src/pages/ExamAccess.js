import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
// material
import {
  Card,
  Link,
  Table,
  Stack,
  Avatar,
  // Button,
  Checkbox,
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
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import { TableListHead, ExamAccessListToolbar } from "../masters/examAccess";
import { getComparator } from "../utils/tableFunctions";
import { Link as RouterLink, useLocation } from "react-router-dom";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "registrationNo", label: "Reg No", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "groupName", label: "Course", alignRight: false },
  { id: "institution", label: "Institution", alignRight: false },
  { id: "email", label: "Email address", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
];

// ----------------------------------------------------------------------
function applySortMultiFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_student) =>
        _student.courseCode
          .toLowerCase()
          .indexOf(query.course.courseCode.toLowerCase()) !== -1 &&
        _student.statusCode
          .toString()
          .indexOf(query.activeStatus.toString()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ExamAccess() {
  const location = useLocation();
  const [STUDENTLIST, setSTUDENTLIST] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("registrationNo");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getStudents = async () => {
    const result = await fetch("http://localhost:5000/students/all");
    const record = await result.json();
    setSTUDENTLIST(record);
    setFilteredStudents(record);
  };
  
  const getSelectedStudents = async () => {
    const result = await fetch(`http://localhost:5000/examAccess/filter?exam_Id=${location.state.examId}`);
    const record = await result.json();
    var selectedRegNo=record.map(rec=>rec.studentRegNo);
    setSelected(selectedRegNo);
  };

  useEffect(() => {
    getStudents();
    getSelectedStudents();
  }, []); 

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleGiveAccess = async (selecteds) => {
    await fetch("http://localhost:5000/examAccess/add", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examId: location.state.examId,
        registrationNumbers: selecteds,
        writtenStatus:0,
      }),
    })
  };

  const handleRemoveAccess = async (selecteds) => {
    console.log("remove");
    console.log(selecteds);
    await fetch("http://localhost:5000/examAccess/remove", {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examId: location.state.examId,
        registrationNumbers: selecteds,
      }),
    })
  };

  const handleSelectAllClick = (event) => {
    handleRemoveAccess(selected);
    const newSelecteds = filteredStudents.map((n) => n.registrationNo);
    if (event.target.checked) {
      setSelected(newSelecteds);
      handleGiveAccess(newSelecteds);
      return;
    }
    handleRemoveAccess(newSelecteds);
    setSelected([]);    
  };

  const handleClick = (event, name) => {
    let arr=[];
    arr.push(name);
    if(event.target.checked){
      handleGiveAccess(arr);
    }
    else{
      handleRemoveAccess(arr);
    }
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

  const handleMultiFilter = (values) => {
    setFilteredStudents(
      applySortMultiFilter(STUDENTLIST, getComparator(order, orderBy), values)
    );
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - STUDENTLIST.length) : 0;

  const isStudentNotFound = filteredStudents.length === 0;

  return (
    <Page title="Exam | Access">
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
            / Access
          </Typography>
        </Stack>

        <Card>
          <ExamAccessListToolbar
            numSelected={selected.length}
            selected={selected}
            multipleFilterValue={handleMultiFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredStudents.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredStudents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        registrationNo,
                        name,
                        email,
                        groupName,
                        institution,
                        avatarUrl,
                        status,
                      } = row;
                      const isItemSelected =
                        selected.indexOf(registrationNo) !== -1;

                      return (
                        <TableRow
                          hover
                          key={registrationNo}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) =>
                                handleClick(event, registrationNo)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar alt={name} src={avatarUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {registrationNo}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{groupName}</TableCell>
                          <TableCell align="left">{institution}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                (status === "inactive" && "error") || "success"
                              }
                            >
                              {sentenceCase(status)}
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
                {isStudentNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery="" />
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
            count={filteredStudents.length}
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
