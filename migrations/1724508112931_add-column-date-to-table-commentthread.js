/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("commentthread", {
    date: {
      type: "TIMESTAMP",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("commentthread", "date");
};
