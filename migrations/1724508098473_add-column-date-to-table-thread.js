/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("thread", {
    date: {
      type: "TIMESTAMP",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("thread", "date");
};
