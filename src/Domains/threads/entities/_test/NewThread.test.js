const NewThread = require("../NewThread");

describe("a NewThread entities", () => {
  it("should throw error when payload did not container needed property", () => {
    const payload = { title: "abc" };

    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = { title: 123, body: true, owner: "121" };

    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_MEET_DATA_SPECIFICATION"
    );
  });

  it("should return newThread object correctly", () => {
    const payload = { title: "abc", body: "description", owner: "user-123" };

    const { title, body, owner } = new NewThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
