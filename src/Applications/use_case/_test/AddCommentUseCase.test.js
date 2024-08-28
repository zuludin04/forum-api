const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const Comments = require("../../../Domains/comments/entities/Comments");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    const generateUserId = () => "user-123";
    const useCasePayload = { content: "comment", thread: "thread-123" };
    const mockComment = new Comments({
      id: "comment-123",
      content: useCasePayload.content,
      owner: generateUserId(),
    });

    const mockCommentRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    const getUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const comment = await getUseCase.execute(generateUserId(), useCasePayload);

    expect(comment).toStrictEqual(
      new Comments({
        id: "comment-123",
        content: useCasePayload.content,
        owner: generateUserId(),
      })
    );
    expect(mockThreadRepository.verifyThreadExistence).toBeCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
        owner: generateUserId(),
        thread: useCasePayload.thread,
      })
    );
  });
});
