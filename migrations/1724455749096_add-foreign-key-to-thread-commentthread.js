/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "commentthread",
    "fk_commentthread.thread_thread.id",
    "FOREIGN KEY(thread) REFERENCES thread(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("commentthread", "fk_commentthread.thread_thread.id");
};
