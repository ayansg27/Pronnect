import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../utils/Spinner";
import { getPost } from "../../actions/postActions";
import Post from "./Post";
import CommentForm from "./CommentForm";
import Comments from "./Comments";

class PostDetail extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }
  render() {
    const { post, loading } = this.props.post;
    let postContent;

    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = (
        <div>
          <Post post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <Comments postId={post._id} comments={post.comments} />
        </div>
      );
    }
    return (
      <div className="post-detail">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back to Feed
              </Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostDetail.propTypes = {
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPost }
)(PostDetail);
