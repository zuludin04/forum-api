class CommentsRepository {
  async addComment(newComment) {
    throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async softDeleteComment(comment) {
    throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async commentsByThread(thread) {
    throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentExistence(comment) {
    throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentOwner(comment, owner) {
    throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentsRepository;
