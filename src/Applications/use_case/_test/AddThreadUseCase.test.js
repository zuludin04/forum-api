const NewThread = require("../../../Domains/threads/entities/NewThread");
const Thread = require("../../../Domains/threads/entities/Thread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    const generateUserId = () => "user-123";
    const useCasePayload = {
      title: "abc",
      body: "description",
    };
    const mockThread = new Thread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: generateUserId(),
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    const getUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const thread = await getUseCase.execute(generateUserId(), useCasePayload);

    expect(thread).toStrictEqual(
      new Thread({
        id: "thread-123",
        title: useCasePayload.title,
        owner: generateUserId(),
      })
    );
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: generateUserId(),
      })
    );
  });
});
