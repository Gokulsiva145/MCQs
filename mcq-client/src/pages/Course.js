import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
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
// components
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
  CourseListHead,
  CourseListToolbar,
  CourseMoreMenu,
} from "../masters/course";
import { getComparator, applySortFilter } from "../utils/tableFunctions";
import FormDialog from "../masters/course/Modal";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "courseCode", label: "Course Code", alignRight: false },
  { id: "groupName", label: "Name", alignRight: false },
  { id: "", label: "Action", alignRight: false },
];

// ----------------------------------------------------------------------

export default function Course() {
  const [COURSELIST, setCOURSELIST] = useState([]);
  const [modalData, setModalData] = useState({});
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("couserCode");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getCourses = async () => {
    const result = await fetch(`http://localhost:5000/courses/all`);
    const record = await result.json();
    setCOURSELIST(record);
  };

  useEffect(() => {
    getCourses();
  }, []);

  // ----Modal controls start---------

  const getData = () => {
    getCourses();
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
      const newSelecteds = COURSELIST.map((n) => n.courseCode);
      console.log(newSelecteds);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - COURSELIST.length) : 0;

  const filteredCourses = applySortFilter(
    COURSELIST,
    getComparator(order, orderBy),
    filterName
  );

  const isCourseNotFound = filteredCourses.length === 0;

  return (
    <Page title="Course | Minimal-UI">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Course
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={() => {
              setModalData(null);
              handleOpenModal(true);
            }}
          >
            New Course
          </Button>
        </Stack>

        <Card>
          <CourseListToolbar
            numSelected={selected.length}
            selected={selected}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteSelected={handleDeleteSelected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CourseListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={COURSELIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCourses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { courseCode, groupName } = row;
                      const isItemSelected =
                        selected.indexOf(courseCode) !== -1;

                      return (
                        <TableRow
                          hover
                          key={courseCode}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) =>
                                handleClick(event, courseCode)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {courseCode}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{groupName}</TableCell>
                          <TableCell align="center">
                            <CourseMoreMenu
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
                {isCourseNotFound && (
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
            count={COURSELIST.length}
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
