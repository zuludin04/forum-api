const Thread = require("../Thread");

describe("a Thread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = { title: "abc" };

    expect(() => new Thread(payload)).toThrowError(
      "THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = { id: "thread-123", title: "abc", owner: true };

    expect(() => new Thread(payload)).toThrowError(
      "THREAD.NOT_MEET_DATA_SPECIFICATION"
    );
  });

  it("should return thread object correctly", () => {
    const payload = { id: "thread-123", title: "abc", owner: "asa" };

    const { id, title, owner } = new Thread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
