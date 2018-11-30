import React, { Component } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";

class Comments extends Component {
  render() {
    const { comments, postId } = this.props;
    return comments.map(comment => (
      <Comment key={comment._id} comment={comment} postId={postId} />
    ));
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired
};

export default Comments;
