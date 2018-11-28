import React, { Component } from "react";
import PropTypes from "prop-types";
import Post from "./Post";

class Feed extends Component {
  render() {
    const { posts } = this.props;
    return posts.map(post => <Post key={post._id} post={post} />);
  }
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default Feed;
