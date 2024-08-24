const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(id, useCasePayload) {
    const newComment = new NewComment({
      content: useCasePayload.content,
      owner: id,
      thread: useCasePayload.thread,
    });
    await this._threadRepository.verifyThreadExistence(useCasePayload.thread);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
