import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    // Container,
    Typography,
    TableContainer,
    TablePagination,
    CircularProgress,
    Box,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// components
import { selectToken } from '../redux/slices/mainSlice';
import Scrollbar from '../components/scrollbar';
import Container from '../layouts/dashboard/container/Container';
import axios from '../components/axios';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import HISTORY from '../_mock/totalTest';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'test-id', label: 'Test ID', alignRight: false },
    { id: 'test-name', label: 'Test Name', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    // { id: 'total-question', label: 'Total Questions', alignRight: false },
    { id: 'view', label: 'View', alignRight: false },
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
    return order === 'desc'
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
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function TotalTestPage() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [testLoading, setTestLoading] = useState(false);
    const [data, setData] = useState([]);

    const token = useSelector(selectToken);

    const navigate = useNavigate();

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getAllTest = async () => {
        try {
            const res = await axios.get(`/get-all-test?token=${token}`);
            // console.log(res.data);
            setData(res.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllTest();
    }, []);

    return (
        <>
            <Helmet>
                <title> Total Test | ESOL IELTS </title>
            </Helmet>
            <ToastContainer />

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Total Test
                    </Typography>
                </Stack>

                <Card>
                    <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        {loading ? (
                            <Box textAlign={'center'} py={2}>
                                <CircularProgress />
                            </Box>
                        ) : data.length <= 0 ? (
                            <Box py={2}>
                                <Typography component={'h2'} textAlign="center">
                                    No Data Found!!
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <UserListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={data.length}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                        {filteredUsers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                const { id, name, created_at, is_taken } = row;

                                                return (
                                                    <TableRow hover key={id}>
                                                        <TableCell component="th" scope="row" padding="normal">
                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {id}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>

                                                        <TableCell align="left">{name}</TableCell>

                                                        <TableCell align="left">
                                                            {new Date(created_at).toLocaleString('en-US')}
                                                        </TableCell>

                                                        <TableCell align="left">
                                                            {is_taken ? (
                                                                <Button
                                                                    variant="contained"
                                                                    color="info"
                                                                    sx={{ ml: 1 }}
                                                                    onClick={() =>
                                                                        navigate('/test/review-test', {
                                                                            state: { id },
                                                                        })
                                                                    }
                                                                >
                                                                    Preview
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    sx={{ color: '#fff' }}
                                                                    disabled={testLoading}
                                                                    onClick={() =>
                                                                        navigate('/test/dashboard', {
                                                                            state: { id },
                                                                        })
                                                                    }
                                                                >
                                                                    Take Test
                                                                </Button>
                                                            )}
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

                                    {isNotFound && (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                    <Paper
                                                        sx={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="h6" paragraph>
                                                            Not found
                                                        </Typography>

                                                        <Typography variant="body2">
                                                            No results found for &nbsp;
                                                            <strong>&quot;{filterName}&quot;</strong>.
                                                            <br /> Try checking for typos or using complete words.
                                                        </Typography>
                                                    </Paper>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                                </Table>
                            </TableContainer>
                        )}
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </>
    );
}
