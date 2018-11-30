import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";
import "../../App.css";

class Experience extends Component {
  onDeleteClick(id) {
    this.props.deleteExperience(id);
  }

  render() {
    const experience =
      this.props.experience.length > 0 ? (
        this.props.experience.map(exp => (
          <tr key={exp._id}>
            <td className="size-30">{exp.company}</td>
            <td className="size-30">{exp.title}</td>
            <td className="size-30">
              <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
              {exp.to === null ? (
                " Now"
              ) : (
                <Moment format="YYYY/MM/DD">{exp.to}</Moment>
              )}
            </td>
            <td className="size-10">
              <button
                onClick={this.onDeleteClick.bind(this, exp._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td>No Experience Added</td>
        </tr>
      );
    return (
      <div>
        <h4 className="mb-4">Experience</h4>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th className="size-30">Company</th>
              <th className="size-30">Title</th>
              <th className="size-30">Years</th>
              <th className="size-10" />
            </tr>
            {experience}
          </thead>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
