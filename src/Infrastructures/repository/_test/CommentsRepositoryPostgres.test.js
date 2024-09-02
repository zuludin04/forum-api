const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const Comments = require("../../../Domains/comments/entities/Comments");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const pool = require("../../database/postgres/pool");
const CommentsRepositoryPostgres = require("../CommentsRepositoryPostgres");

describe("CommentsRepositoryPostgres", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    });
    await ThreadTableTestHelper.addThread({
      id: "thread-123",
      title: "abc",
      body: "description",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addComment function", () => {
    it("should return comment object correctly", async () => {
      const newComment = new NewComment({
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
      });
      const fakeIdGenerator = () => "123";

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const comment = await commentsRepositoryPostgres.addComment(newComment);

      expect(comment).toStrictEqual(
        new Comments({
          id: "comment-123",
          content: "comment",
          owner: "user-123",
        })
      );
    });
  });

  describe("softDeleteComment functiom", () => {
    it("should should return comment result correctly", async () => {
      const commentTest = {
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
        date: Date.now() / 1000,
      };
      await CommentsTableTestHelper.addComment(commentTest);
      const payload = { id: "comment-123", owner: "user-123" };

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(
        pool,
        {}
      );

      const comment = await commentsRepositoryPostgres.softDeleteComment(
        payload.id
      );

      expect(comment).toStrictEqual({
        id: "comment-123",
        owner: "user-123",
        is_delete: 1,
      });
    });
  });

  describe("commentsByThread function", () => {
    it("should return array of comment object", async () => {
      const comment = {
        id: "comment-124",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
        date: Date.now() / 1000,
      };
      await CommentsTableTestHelper.addComment(comment);

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(
        pool,
        {}
      );

      const comments = await commentsRepositoryPostgres.commentsByThread(
        "thread-123"
      );
      expect(comments).toBeTruthy();
      expect(comments).toStrictEqual([
        new DetailComment({
          id: "comment-124",
          username: "dicoding",
          content: "comment",
          date: new Date(Date(comment.date)).toDateString(),
          isDeleted: 0,
        }),
      ]);
    });
  });

  describe("verifyCommentExistence function", () => {
    it("should throw NotFound error when comment not found", async () => {
      const payload = { id: "thread", owner: "user-123" };

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentsRepositoryPostgres.verifyCommentExistence(payload)
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFound error if comment was found", async () => {
      const commentTest = {
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
        date: Date.now() / 1000,
      };
      await CommentsTableTestHelper.addComment(commentTest);

      const payload = { id: "comment-123", owner: "user-123" };

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentsRepositoryPostgres.verifyCommentExistence(payload.id)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError when comment accessed by unauthorized user", async () => {
      const commentTest = {
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
        date: Date.now() / 1000,
      };
      await CommentsTableTestHelper.addComment(commentTest);
      const payload = { id: "comment-123", owner: "user-124" };

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentsRepositoryPostgres.verifyCommentOwner(payload.id, payload.owner)
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment accessed by the right user", async () => {
      const commentTest = {
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
        date: Date.now() / 1000,
      };
      await CommentsTableTestHelper.addComment(commentTest);

      const payload = { id: "comment-123", owner: "user-123" };

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentsRepositoryPostgres.verifyCommentOwner(payload.id, payload.owner)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
});
