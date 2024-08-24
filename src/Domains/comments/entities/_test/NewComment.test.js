const NewComment = require("../NewComment");

describe("a Comment enitities", () => {
  it("should throw error when payload did not contain needed propertiy", () => {
    const payload = { content: "comment" };

    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = { thread: 123, content: true, owner: [] };

    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION"
    );
  });

  it("should return newComment object correctly", () => {
    const payload = {
      content: "comment",
      owner: "user-123",
      thread: "thread-123",
    };

    const { content, owner, thread } = new NewComment(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
  });
});
