Array.prototype.rotate = (function() {
  var unshift = Array.prototype.unshift,
    splice = Array.prototype.splice;

  return function(count) {
    unshift.apply(this, splice.call(this, count % this.length, this.length));
    return this;
  };
})();

// @struct -> [[T]]
//    expected to be an array of arrays where every inner array
//    is of the same length
RotatableMatrix = function (items) {
  this.items = items;
  this.height = items.length;
  this.width = items[0].length;
};

RotatableMatrix.prototype.getRow = function (y) {
  return this.items[y];
};

RotatableMatrix.prototype.setRow = function (y, row) {
  return this.items[y] = row;
};

RotatableMatrix.prototype.setColumn = function (x, column) {
  for (var i = 0; i < this.height; i++) {
    this.getRow(i)[x] = column[i];
  }
  return this.getColumn(x);
};

RotatableMatrix.prototype.getColumn = function (x) {
  var column = [];
  for (var i = 0; i < this.height; i++) {
    column.push(this.getRow(i)[x]);
  }
  return column;
};

// @y -> Int
// @direction -> Int
RotatableMatrix.prototype.rotateRow = function (y, count) {
  return this.getRow(y).rotate(count);
};

// @x -> Int
// @direction -> Int
RotatableMatrix.prototype.rotateColumn = function (x, count) {
  return this.setColumn(x, this.getColumn(x).rotate(count));
};

RotatableMatrix.prototype.withElements = function (callback) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      callback(this.items[y][x], x, y);
    }
  }
};

if (typeof window === "undefined") {
  exports.RotatableMatrix = RotatableMatrix;
}
