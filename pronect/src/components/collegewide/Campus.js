import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../utils/Spinner";
import CampusItem from "./CampusItem";
import { getProfiles } from "../../actions/profileActions";

class Campus extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }
  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <CampusItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found!</h4>;
      }
    }
    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Campus</h1>
              <p className="lead text-center">
                Connect with people from your college/university.
              </p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Campus.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Campus);
