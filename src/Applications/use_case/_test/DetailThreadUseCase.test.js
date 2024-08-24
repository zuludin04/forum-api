const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DetailThreadUseCase = require("../DetailThreadUseCase");

describe("DetailThreadUseCase", () => {
  it("should be orchestrating detail thread use case correctly", async () => {
    const threadId = "thread-123";

    const comment = {
      id: "comment-123",
      content: "comment",
      date: "2024-08-24",
      username: "dicoding",
    };

    const detailThread = {
      id: "thread-123",
      title: "abc",
      body: "description",
      date: "2024-08-24",
      username: "dicoding",
    };

    const mockCommentsRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.commentsByThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve([comment]));
    mockThreadRepository.detailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(detailThread));

    const getUseCase = new DetailThreadUseCase({
      commentRepository: mockCommentsRepository,
      threadRepository: mockThreadRepository,
    });

    const detail = await getUseCase.execute(threadId);

    expect(detail).toStrictEqual({
      id: "thread-123",
      title: "abc",
      body: "description",
      date: "2024-08-24",
      username: "dicoding",
      comments: [comment],
    });
    expect(mockCommentsRepository.commentsByThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.detailThread).toBeCalledWith(threadId);
  });
});
