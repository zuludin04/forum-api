const Comments = require("../Comments");

describe("a Comment enitities", () => {
  it("should throw error when payload did not contain needed propertiy", () => {
    const payload = { content: "comment" };

    expect(() => new Comments(payload)).toThrowError(
      "COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = { id: 123, content: true, owner: [] };

    expect(() => new Comments(payload)).toThrowError(
      "COMMENTS.NOT_MEET_DATA_SPECIFICATION"
    );
  });

  it("should return comments object correctly", () => {
    const payload = {
      id: "comment-123",
      content: "comment",
      owner: "user-123",
    };

    const { id, content, owner } = new Comments(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
