class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const payload = { id: useCasePayload.commentId, owner: userId };
    await this._threadRepository.verifyThreadExistence(useCasePayload.threadId);
    await this._commentRepository.verifyCommentExistence(
      useCasePayload.commentId
    );
    await this._commentRepository.verifyCommentOwner(payload.id, payload.owner);
    await this._commentRepository.softDeleteComment(payload.id);
  }
}

module.exports = DeleteCommentUseCase;
