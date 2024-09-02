const DetailComment = require("../DetailComment");

describe("a DetailComment entities", () => {
  it("should throw error when payload did not contain needed property", async () => {
    const payload = { id: "comment-123" };

    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.DID_NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data specification", async () => {
    const payload = {
      id: 123,
      content: 123,
      date: 123,
      username: 123,
      isDeleted: "123",
    };

    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.DID_NOT_MEET_DATA_SPECIFICATION"
    );
  });

  it("should return detail comment object correctly when there is deleted comment", async () => {
    const payload = {
      id: "comment-123",
      content: "comment",
      date: "02-Sept-2024",
      username: "user123",
      isDeleted: 1,
    };

    const { id, content, date, username } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual("**komentar telah dihapus**");
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  it("should return detail comment object correctly", async () => {
    const payload = {
      id: "comment-123",
      content: "comment",
      date: "02-Sept-2024",
      username: "user123",
      isDeleted: 0,
    };

    const { id, content, date, username } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
