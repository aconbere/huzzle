var game = function (setup, draw, options) {
  setup.apply(this, [options])
  function doDraw () {
    setTimeout(function () {
      draw.apply(this);
      doDraw();
    }, 50);
  }
  doDraw();
};

var clickAndDrag = function (canvas, start, drag, end) {
  canvas.mousedown(function (e) {

    var mouseMoveHandler = function (e2) {
      if (drag) return drag(e2);
    };
    canvas.mousemove(mouseMoveHandler);

    canvas.mouseup(function (e3) {
      canvas.unbind("mousemove", mouseMoveHandler);
      if (end) return end(e3);
    });

    if (start) return start(e);
  });
};

var getCursorPosition = function (x, y, width, height, offset, pieceWidth) {
  x -= offset.left;
  y -= offset.top;
  x = Math.min(x, width - 1);
  y = Math.min(y, height - 1);
  var cell = [Math.floor(x / pieceWidth), Math.floor( y / pieceWidth)];
  return cell;
};

// Defines the list of available colors used to seed the board
var COLORS = [ "#1d5a73"
             , "#3B848c"
             , "#8abfb0"
             , "#c4d9bf"
             , "#d91e0d"
             ];

COLORS.random = function () {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

// A piece is a rectangle on the board
var Piece = function (color) {
  this.color = color;
};

Piece.width = 50;

Piece.prototype.draw = function (x, y, context) {
  x = x * Piece.width;
  y = y * Piece.width;
  context.fillStyle = this.color;
  context.fillRect(x, y, Piece.width, Piece.width);
}

// The selector is a special piece used to indicate where we're clicking
var Selector = function (x, y) {
  this.x = x;
  this.y = y;
  this.color = "rgba(255, 255, 255, 0.2)";
};

Selector.prototype.draw = function (context) {
  Piece.prototype.draw.call(this, this.x, this.y, context);
}

// the board is a wrapper around a RotatableMatrix
var Board = function (pieces) {
  this.matrix = new RotatableMatrix(pieces);
};

Board.prototype.draw = function (context) {
  this.matrix.withElements(function (p, x, y) {
    p.draw(x, y, context);
  });
};

Board.random = function (count) {
  var columns = [];

  for (var i = 0; i < count[0]; i++) {
    var rows = [];
    for (var j = 0; j < count[1]; j++) {
      rows.push(new Piece(COLORS.random()));
    }
    columns.push(rows);
  }
  return new Board(columns);
};

var rotateGroup = function (gameState) {
  var clickedCell
    , moveXorY
    // clickX and clickY are used to determine our delta and lock movement
    // to horizontal or vertical
    , clickX
    , clickY
    , clickedPiece
    , delta = 10
    // copy the old board to a new board
    , originalColor
    , nextCell
    , clickOverlay

  clickAndDrag(gameState.canvas, function (e) {
    clickX = e.pageX;
    clickY = e.pageY;
    clickedCell = getCursorPosition(e.pageX,
                                    e.pageY,
                                    gameState.width,
                                    gameState.height,
                                    gameState.canvas.offset(),
                                    gameState.pieceWidth);
    nextCell = [clickedCell[0], clickedCell[1]];
    clickedPiece = gameState.board.matrix.items[clickedCell[1]][clickedCell[0]];
    gameState.selector = new Selector(clickedCell[0], clickedCell[1]);

    // reset our horizontal / vertical lock
    moveXorY = undefined;
    return false;
  }, function (e) {
    if (!moveXorY) {
      var difX = Math.abs(e.pageX - clickX);
      var difY = Math.abs(e.pageY - clickY);

      // at "delta" lock the movement into either horizontal or vertical
      if (difX < delta && difY < delta) return false;

      moveXorY = Math.abs(e.pageX - clickX) > Math.abs(e.pageY - clickY) ? "x" : "y"
    }

    var cursor = getCursorPosition(e.pageX,
                                   e.pageY,
                                   gameState.width,
                                   gameState.height,
                                   gameState.canvas.offset(),
                                   gameState.pieceWidth);

    var rotate = function (bool) {
      i = bool ? 1 : 0
      j = bool ? 0 : 1

      // if there isn't enough movement to justify moving don't
      if (nextCell[i] == cursor[i]) {
        return false
      }

      var diff = nextCell[i] - cursor[i];

      gameState.board.matrix[bool ? "rotateColumn" : "rotateRow"](clickedCell[j], diff);
      nextCell[i] = cursor[i];
      gameState.selector[bool ? "y" : "x"] = cursor[i];
    }

    rotate(moveXorY == "y");

    return false;
  }, function (e) {
    gameState.selector = undefined;
    var groups = findGroups(gameState.board.matrix);
    console.log(groups);
    groups.forEach(function (g) {
      g.forEach(function (p) {
        p.color = "#000";
      });
    });
  });
};

var findGroups = function (matrix, minSize) {
  var walk = function (start, matrix, x, y) {
    if (start.marked) return false;

    var search = function (_x, _y) {
      _x = _x || 0;
      _y = _y || 0;
      newX = x + _x;
      newY = y + _y;
      n = matrix.items[newY][newX];
      // if the color is the same, and we haven't already
      // seen this piece, then recurse!
      if (start.color == n.color && !n.marked) {
        start.marked = true;
        return walk(n, matrix, newX, newY);
      } else {
        return [];
      }
    };

    neighbors = [start];
    if (x !== 0) {
      neighbors = neighbors.concat(search(-1, 0));
    }
    if (x !== 9) {
      neighbors = neighbors.concat(search(1, 0));
    }
    if (y !== 0) {
      neighbors = neighbors.concat(search(0, -1));
    }
    if (y !== 9) {
      neighbors = neighbors.concat(search(0, 1));
    }
    return neighbors;
  };

  var groups = [];
  matrix.withElements(function (p, x, y) {
    var group = walk(p, matrix, x, y);
    if (group.length >= 3) {
      groups.push(group);
    }
  });
  matrix.withElements(function (p, x, y) {
    p.marked = false;
  });
  return groups;
};

$(function () {
  game(function () {
    var canvas = $("#huzzle-canvas");
    var count = [10, 10];
    var pieceWidth = 50;
    this.gameState = { "canvas": canvas
                     , "context": canvas[0].getContext("2d")
                     , "count": count 
                     , "pieceWidth": pieceWidth
                     , "width": count[0] * pieceWidth
                     , "height": count[1] * pieceWidth
                     , "board": new Board.random(count)
                     , "selector": undefined // a piece to cover up the click selection
                     };

    this.gameState.canvas.height(gameState.width);
    this.gameState.canvas.height(gameState.height);

    rotateGroup(gameState);
  }, function () {
    this.gameState.board.draw(this.gameState.context);
    if (this.gameState.selector) {
      this.gameState.selector.draw(this.gameState.context);
    }
  });
});
