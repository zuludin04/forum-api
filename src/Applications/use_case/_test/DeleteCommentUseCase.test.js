const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentDeleteUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should be orchestrating the delete comment use case correctly", async () => {
    const generateUserId = () => "user-123";
    const useCasePayload = { commentId: "comment-123", threadId: "thread-123" };

    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.softDeleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getUseCase = new CommentDeleteUseCase({
      commentRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
    });

    await getUseCase.execute(generateUserId(), useCasePayload);

    expect(mockCommentsRepository.softDeleteComment).toHaveBeenCalledWith({
      id: useCasePayload.commentId,
      owner: generateUserId(),
    });
  });
});
