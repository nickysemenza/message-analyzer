import { connect } from 'react-redux';
import { fetchUsers } from '../../actions/facebookUsersActions';
import Dashboard from './Dashboard';

function mapStateToProps (state) {
  return {
    users: state.facebookUsers
  };
}

const mapDispatchToProps = (dispatch) => ({
  loadData: () => {
    dispatch(fetchUsers());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
