import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteEducation } from "../../actions/profileActions";
import "../../App.css";

class Education extends Component {
  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }

  render() {
    const education =
      this.props.education.length > 0 ? (
        this.props.education.map(edu => (
          <tr key={edu._id}>
            <td className="size-30">{edu.school}</td>
            <td className="size-30">{edu.degree}</td>
            <td className="size-30">
              <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
              {edu.to === null ? (
                " Now"
              ) : (
                <Moment format="YYYY/MM/DD">{edu.to}</Moment>
              )}
            </td>
            <td className="size-10">
              <button
                onClick={this.onDeleteClick.bind(this, edu._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td>No Education Added</td>
        </tr>
      );

    return (
      <div>
        <h4 className="mb-4">Education</h4>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th className="size-30">School</th>
              <th className="size-30">Degree</th>
              <th className="size-30">Years</th>
              <th className="size-10" />
            </tr>
            {education}
          </thead>
        </table>
      </div>
    );
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
