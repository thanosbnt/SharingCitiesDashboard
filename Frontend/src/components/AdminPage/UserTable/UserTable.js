import React from 'react';
import PropTypes from 'prop-types';

import UserTableHead from './UserTableHead';
import UserTableBody from './UserTableBody';
import UserTablePagination from './UserTablePagination';
import SearchIcon from '@material-ui/icons/Search';
import PlusIcon from '@material-ui/icons/Add';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// redux
import { connect } from 'react-redux';
import {fetchUsers, promptDeleteUser} from "../../../actions/adminActions";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'scroll',
    maxHeight: '70vh',
  },
  table: {
    minWidth: 640,
  },
  noData: {
    textAlign: 'center'
  },
  noDataMessage: {
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  noDataIcon: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
    width: '100%'
  },
  actionButtonIcon: {
    marginRight: theme.spacing.unit,
  },
  tableTitleActionButton: {
    width: '175px',
    float: "right",
    margin: theme.spacing.unit * 2
  },
});

const DEFAULT_ORDER = 'desc';
const DEFAULT_ORDER_BY = 'Timestamp';

const columns = [
  {id: "id", label: "ID", numeric: false},
  {id: "fullname", label: "Full Name", numeric: true},
  {id: "email", label: "Email", numeric: false},
  {id: "activated", label: "Activated", numeric: false},
  {id: "admin", label: "Admin", numeric: false},
]

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchUsers();
    this.state = {
      order: DEFAULT_ORDER,
      orderBy: DEFAULT_ORDER_BY,
      selected: [],
      page: 0,
      rowsPerPage: 10,
      selectedImporter: {}
    };
  }

  handleRequestSort = (e, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (e, page) => {
    this.setState({ page })
  };

  handleDeleteUserClick = (selectedUser) => {
    this.props.promptDeleteUser(selectedUser)
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  };

  isSelected = (id) => {
    return this.state.selected.includes(id)
  };

  render() {
    const { classes, admin, user } = this.props;
    const { order, orderBy, selected, page, rowsPerPage } = this.state;

    return (
      <div className={classes.root}>
        {
          admin.users && admin.users.length > 0
            ? <Paper>
                <div className={classes.tableWrapper}>
                  <Button variant="contained" color="primary" className={classes.tableTitleActionButton} onClick={this.props.openAddUser}>
                    <PlusIcon className={classes.actionButtonIcon}/>
                    Add User
                  </Button>
                  <Table className={classes.table} aria-labelledby="tableTitle">
                    <UserTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={this.handleRequestSort}
                      columns={columns}
                      rowCount={admin.users.length}
                    />
                    <UserTableBody
                      data={admin.users}
                      columns={columns}
                      order={order}
                      orderBy={orderBy}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onClick={this.handleClick}
                      loggedInUser={user}
                      onDeleteUserClick={this.handleDeleteUserClick}
                      isSelected={this.isSelected}
                    />
                  </Table>
                </div>
                <UserTablePagination
                  data={admin.users}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
            : <Paper>
              <div className={classes.tableWrapper}>
                <Typography variant="subtitle1" color="primary" className={classes.noDataMessage}>
                  <SearchIcon className={classes.noDataIcon}/>
                  Problem loading users
                </Typography>
              </div>
            </Paper>
        }
      </div>
    )
  }
}

UserTable.propTypes = {
  classes: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  api: state.api,
  admin: state.admin,
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUsers: () => dispatch(fetchUsers()),
  promptDeleteUser: (userID) => dispatch(promptDeleteUser(userID)),
});

UserTable = withStyles(styles)(UserTable);
UserTable = connect(mapStateToProps, mapDispatchToProps)(UserTable);

export default UserTable