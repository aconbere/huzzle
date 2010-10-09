var sys = require("sys");
var minitest = require("minitest");
var assert = require("assert");
var RotatableMatrix = require("../js/rotateable_matrix").RotatableMatrix;

minitest.context("RotatableMatrix", function () {
  this.setup(function () {
    this.testMatrix = [ [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                      , [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                      , [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                      , [30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
                      , [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
                      , [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
                      , [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]
                      , [70, 71, 72, 73, 74, 75, 76, 77, 78, 79]
                      , [80, 81, 82, 83, 84, 85, 86, 87, 88, 19]
                      , [90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
                      ];
  });

  this.assertion("rotateRow should rotate a row", function (test) {
    var r = new RotatableMatrix(this.testMatrix);
    assert.deepEqual(r.rotateRow(1,1), [11, 12, 13, 14, 15, 16, 17, 18, 19, 10]);
    assert.deepEqual(this.testMatrix, [ [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                                      , [11, 12, 13, 14, 15, 16, 17, 18, 19, 10]
                                      , [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                                      , [30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
                                      , [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
                                      , [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
                                      , [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]
                                      , [70, 71, 72, 73, 74, 75, 76, 77, 78, 79]
                                      , [80, 81, 82, 83, 84, 85, 86, 87, 88, 19]
                                      , [90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
                                      ]);
    test.finished();
  });

  this.assertion("rotateColumn should rotate a column", function (test) {
    var r = new RotatableMatrix(this.testMatrix);
    assert.deepEqual(r.rotateColumn(1,1), [11, 21, 31, 41, 51, 61, 71, 81, 91, 1]);
    assert.deepEqual(this.testMatrix, [ [0, 11, 2, 3, 4, 5, 6, 7, 8, 9]
                                      , [10, 21, 12, 13, 14, 15, 16, 17, 18, 19]
                                      , [20, 31, 22, 23, 24, 25, 26, 27, 28, 29]
                                      , [30, 41, 32, 33, 34, 35, 36, 37, 38, 39]
                                      , [40, 51, 42, 43, 44, 45, 46, 47, 48, 49]
                                      , [50, 61, 52, 53, 54, 55, 56, 57, 58, 59]
                                      , [60, 71, 62, 63, 64, 65, 66, 67, 68, 69]
                                      , [70, 81, 72, 73, 74, 75, 76, 77, 78, 79]
                                      , [80, 91, 82, 83, 84, 85, 86, 87, 88, 19]
                                      , [90, 1, 92, 93, 94, 95, 96, 97, 98, 99]
                                      ]);
    test.finished();
  });
});
