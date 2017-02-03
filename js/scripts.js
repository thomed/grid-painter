var weeDiv = "<div class='wee-div'></div>";
var rowDiv = "<div class='row grid-row'></div>";
var col = 1;
var row = 1;
var numColumns = 50;
var numRows = 50;

var mouseDown = false;

var color = "blue";


$(document).ready(function () {
    initGrid();

    $(document).mousedown(function () {
        mouseDown = true;
    });
    $(document).mouseup(function () {
        mouseDown = false;
    });
});

function setColor() {
    color = "#" + $("#colorText").val();
    console.log("color changed to " + color);
}

function clearCanvas() {
    $(".wee-div").css({'background-color': 'white'});
    console.log("cleared");
}

function initGrid() {
    for (gridRow = 0; gridRow < numRows; gridRow++) {
        $("#grid-area").append(rowDiv);
        for (gridColumn = 0; gridColumn < numColumns; gridColumn++) {
            var divColClass = "column-" + col;
            var divRowClass = "row-" + row;
            $("#grid-area").children().last().append(weeDiv);
            $("#grid-area").children().last().children().last().addClass(divRowClass + " " + divColClass);
            col++;
        }
        col = 0;
        row++;
    }

    $(".grid-row").children().each(function () {
        $(this).mouseover(function () {
            if (mouseDown) {
                $(this).css({'background-color': color});
            }
        });
        $(this).click(function () {
            $(this).css({'background-color': color});
        });
    });
}