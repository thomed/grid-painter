// ingredients
var col = 1, row = 1;
var numColumns = 50, numRows = 50;
var mouseDown = false;
var color = "#00f";

// html div strings
var weeDiv = "<div class='wee-div'></div>";
var rowDiv = "<div class='row grid-row'></div>";

// html div classes
var divColClass = "column-" + col, divRowClass = "row-" + row;

$(document).ready(function () {
    initGrid();

    $(document).mousedown(function () {
        mouseDown = true;
    });
    $(document).mouseup(function () {
        mouseDown = false;
    });
    
    $("#color-text").change(function() {
        color = "#" + $("#color-text").val();
    });
});

function initGrid() {
    for (gridRow = 0; gridRow < numRows; gridRow++) {
        $("#grid-area").append(rowDiv);
        for (gridColumn = 0; gridColumn < numColumns; gridColumn++) {
            getLastChild().append(weeDiv);
            getLastGrandchild().addClass(divRowClass + " " + divColClass);
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

function clearCanvas() {
    $(".wee-div").css({'background-color': 'white'});
}

function getLastChild() {
    return $("#grid-area").children().last();
}

function getLastGrandchild() {
    return $("#grid-area").children().last().children().last();
}
