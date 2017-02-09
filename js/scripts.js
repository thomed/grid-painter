// ingredients
var col = 1, row = 1;
var numColumns = 5, numRows = 5;
var mouseDown = false;
var color = "#00f";
var gridArr;

// html div strings
var weeDiv = "<div class='wee-div'></div>";
var rowDiv = "<div class='row grid-row'></div>";

// html div classes
var divColClass = "column-" + col, divRowClass = "row-" + row;

$(document).ready(function () {
    initGrid();

    // drag & draw bools
    $(document).mousedown(function () {
        mouseDown = true;
    });
    $(document).mouseup(function () {
        mouseDown = false;
    });

    // change color when selected
    $("#color-text").change(function () {
        color = "#" + $("#color-text").val();
    });

    // increase cell size with slider
    $("#scale-slider").slider({
        value: 10,
        min: 8,
        max: 40,
        slide: function (event, ui) {
            $(".wee-div").css({"height": ui.value + "px", "width": ui.value + "px"});
            $(".grid-row").css({"height": ui.value + "px"});
        }
    });

    // enable/disable grid with checkbox
    $("#grid-checkbox").change(function () {
        if (!$("#grid-checkbox").is(":checked")) {
            $(".wee-div").css({"border": "none"});
        } else {
            $(".wee-div").css({"border": "solid 1px black"});
        }
    });

});

function initGrid() {
    gridArr = new Array(numColumns);

    for (gridRow = 0; gridRow < numRows; gridRow++) {
        gridArr[gridRow] = new Array(numRows);

        $("#grid-area").append(rowDiv);
        for (gridColumn = 0; gridColumn < numColumns; gridColumn++) {
            gridArr[gridRow][gridColumn] = getLastChild().append(weeDiv).children().last();
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

/**
 * Gathers the background-color css property from each cell in the grid and saves
 * or updates the separate values on that object.
 */
function parseColors() {
    var gridCell, rawRGB;

    for (gridRow = 0; gridRow < numRows; gridRow++) {
        for (gridColumn = 0; gridColumn < numColumns; gridColumn++) {
            gridCell = gridArr[gridRow][gridColumn];
            rawRGB = gridCell.css("background-color").split(",");
            gridCell.r = rawRGB[0].trim().slice(rawRGB[0].indexOf("(") + 1, rawRGB[0].length);
            gridCell.g = rawRGB[1].trim();
            gridCell.b = rawRGB[2].trim().slice(0, rawRGB[2].indexOf(")") - 1);
            console.log(gridCell.r + " " + gridCell.g + " " + gridCell.b);
        }
    }
}

/**
 * generate (but don't display!) canvas.
 * then get a data URI/URL for the canvas which can then be applied to the 
 * download link
 */
function generateCanvas() {
    parseColors();
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var imgData = ctx.createImageData(numColumns, numRows);
    var colorData = imgData.data;
    canvas.width = numColumns;
    canvas.height = numRows;
    document.body.appendChild(canvas);
    
    for(gridRow = 0; gridRow < numRows; gridRow++) {
        for(gridColumn = 0; gridColumn < numColumns; gridColumn++) {
            var gridCell = gridArr[gridRow][gridColumn];
            colorData[0] = gridCell.r;
            colorData[1] = gridCell.g;
            colorData[2] = gridCell.b;
            colorData[3] = "255";
            ctx.putImageData(imgData, gridColumn, gridRow);
        }
    }
    
    document.body.removeChild(canvas);
    return canvas.toDataURL("image/png");
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

function downloadPNG(uri) {
    var link = document.createElement("a");
    link.download = "asdf.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

$("#download-btn").click(function () {
    downloadPNG(generateCanvas());
});
