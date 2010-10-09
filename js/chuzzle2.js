var withProgram = function (prog) {
  var api = {};

  var canvas
    , context;

  api.withCanvas = function (block) {
    canvas = $("#chuzzle-canvas");
    context = canvas[0].getContext("2d");
    block.apply(null, [canvas, context])
  };

  prog.call(api);
};

var drawGrid = function (context, pieceX, pieceY, width, height, color) {
  context.beginPath();

  for (var x = 0.5; x < width; x += pieceX) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }

  for (var y = 0.5; y < height; y += pieceY) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }

  context.strokeStyle = "#eee";
  context.stroke();
};

var Cell = function (row, column) {
  this.row = row;
  this.column = column;
}

var getCursorPosition = function (x, y, width, height, offset, pieceX, pieceY) {
  x -= offset.left;
  y -= offset.top;
  x = Math.min(x, width - 1);
  y = Math.min(y, height - 1);
  var cell = [Math.floor(x / pieceX), Math.floor( y / pieceY)];
  return cell;
};

var fillCell = function (context, pieceX, pieceY, row, column, color) {
  context.fillStyle = color;
  var x = pieceX * row;
  var y = pieceY * column;
  context.fillRect(x, y, pieceX, pieceY)
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

var drawOnDrag = function (canvas, context, pieceX, pieceY, width, height, offset) {
  var clickedCell
    , moveXorY
    , delta = 10
    , clickX
    , clickY

  clickAndDrag(canvas, function (e) {
    // Cache a bunch of values outside of this closure to be referenced on drag
    clickedCell = getCursorPosition(e.pageX, e.pageY, width, height, offset, pieceX, pieceY);
    clickX = e.pageX;
    clickY = e.pageY;
    // reset our horizontal / vertical lock
    moveXorY = undefined;

    // fill the rectangle on click
    fillCell(context, pieceX, pieceY, clickedCell[0], clickedCell[1], "#ff0000");
    return false;
  }, function (e) {
    if (!moveXorY) {
      var difX = Math.abs(e.pageX - clickX);
      var difY = Math.abs(e.pageY - clickY);

      // at "delta" lock the movement into either horizontal or vertical
      if (difX < delta && difY < delta) return false;

      console.log("x: " + e.pageX + ", " + clickX);
      console.log("y: " + e.pageY + ", " + clickY);
      moveXorY = Math.abs(e.pageX - clickX) > Math.abs(e.pageY - clickY) ? "x" : "y"
    }

    var cursor = getCursorPosition(e.pageX, e.pageY, width, height, offset, pieceX, pieceY);

    if (moveXorY == "y") {
      fillCell(context, pieceX, pieceY, clickedCell[0], cursor[1], "#00ff00");
    } else {
      fillCell(context, pieceX, pieceY, cursor[0], clickedCell[1], "#00ff00");
    }

    return false;
  });
};

$(function () {
  withProgram(function () {
    this.withCanvas(function (canvas, context) {
      var offset = canvas.offset();
      var countX = 10;
      var countY = 10;
      var width = canvas.width();
      var height = canvas.height();
      var pieceX = width / countX;
      var pieceY = height / countY;

      drawOnDrag(canvas, context, pieceX, pieceY, width, height, offset);
      drawGrid(context, pieceX, pieceY, width, height, "#eee");
    });
  });
});
