const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const Thread = require("../../../Domains/threads/entities/Thread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    });
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addThread function", () => {
    it("should return new thread correctly", async () => {
      const newThread = new NewThread({
        title: "abc",
        body: "description",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const thread = await threadRepositoryPostgres.addThread(newThread);

      expect(thread).toStrictEqual(
        new Thread({ id: "thread-123", title: "abc", owner: "user-123" })
      );
    });

    it('should persist added thread and return thread correctly', async () => {
      const newThread = new NewThread({
        title: "abc",
        body: "description",
        owner: "user-123",
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgres.addThread(newThread);

      const thread = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });
  });

  describe("verifyThreadExistence function", () => {
    it(`should throw NotFound error when there aren't thread available`, async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadExistence("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it(`should not throw NotFound error when thread available`, async () => {
      await ThreadTableTestHelper.addThread({ id: "thread-123" });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadExistence("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("detailThread function", () => {
    it("should return detail thread object", async () => {
      const threadId = "thread-123";
      await ThreadTableTestHelper.addThread({ id: threadId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.detailThread(threadId);

      expect(thread).toBeTruthy();
      expect(thread.username).toEqual("dicoding");
      expect(thread.id).toEqual("thread-123");
      expect(thread.title).toEqual("abc")
      expect(thread.body).toEqual("description")
    });
  });
});
