class DetailThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExistence(threadId);

    const comments = await this._commentRepository.commentsByThread(threadId);
    const thread = await this._threadRepository.detailThread(threadId);

    const detailThread = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: comments,
    };

    return detailThread;
  }
}

module.exports = DetailThreadUseCase;
