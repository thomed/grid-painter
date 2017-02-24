/**
 * TODO:
 * - Various UI improvements
 *      -- Prevent grid from hiding behind sidebar
 * - Make transparent cells perceptible
 * - Fix conflict with eraser and eyedropper
 * 
 * Stretch goals:
 * - Additional drawing tools
 * - Exported image scaling
 * - Undo / Redo
 */

// ingredients
var numColumns = 24, numRows = 24;
var col = 1, row = 1;
var mouseDown = false, eyeDropper = false;
var color = "#00f";
var gridArr;
var cellSize = 15;

// html div strings
var weeDiv = "<div class='wee-div'></div>";
var rowDiv = "<div class='row grid-row'></div>";

// html div classes
var divColClass = "column-" + col, divRowClass = "row-" + row;

$(function () {
    initGrid();
    initPalette();

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
        addPaletteColor(color);
    });

    // increase cell size with slider
    $("#scale-slider").slider({
        value: 15,
        min: 8,
        max: 40,
        slide: function (event, ui) {
            cellSize = ui.value;
            $(".wee-div").css({"height": cellSize + "px", "width": cellSize + "px"});
            $(".grid-row").css({"height": cellSize + "px"});
        }
    });

    // enable/disable grid with checkbox
    $("#grid-checkbox").change(function () {
        $("#grid-checkbox").is(":checked") ? $(".wee-div").css({"border": "solid 1px black"}) : $(".wee-div").css({"border": "none"});
    });
});

function initGrid() {
    gridArr = new Array(numColumns);
    for (gridRow = 0; gridRow < numRows; gridRow++) {
        gridArr[gridRow] = new Array(numRows);

        $("#grid-area").append(rowDiv);
        for (gridColumn = 0; gridColumn < numColumns; gridColumn++) {

            gridArr[gridRow][gridColumn] = addCell(getLastChild());
            col++;
        }
        col = 0;
        row++;
    }
    $("#dimensions").text("Dimensions: " + $(getLastChild()).children().length + "x" + $("#grid-area").children().length);
}

function initPalette() {
    $("#palette").empty();
    $("#palette").append("<tr></tr>");
    addPaletteColor("black");
    addPaletteColor("grey");
    addPaletteColor("white");
    addPaletteColor("red");
    addPaletteColor("green");
    addPaletteColor("blue");
    addPaletteColor("yellow");
}

function addPaletteColor(c) {
    var newPaletteCell = $("#palette").children().last().append("<td></td>").children().last();
    newPaletteCell.attr({"title": c + " - Click scroll wheel to remove"});
    newPaletteCell.css({"background-color": c});
    newPaletteCell.on("click auxclick", function (e) {
        if (e.which === 2) {
            e.preventDefault();
            newPaletteCell.remove();
        } else {
            color = parseRGBtoHex(newPaletteCell.css("background-color"));
            $("#color-text").val(color.split("#")[1].toUpperCase());
            $("#color-text").css({"background-color": color});
        }
    });
}

/**
 * Takes color in raw rgb format and returns hex with leading #
 */
function parseRGBtoHex(o) {
    var rawRGB = o.split("(")[1].split(")")[0];
    rawRGB = rawRGB.split(",");
    var hex = rawRGB.map(function (c) {
        c = parseInt(c).toString(16);
        return (c.length === 1) ? "0" + c : c;
    });

    return("#" + hex.join(""));
}

/**
 * Gathers the background-color css property from each cell in the grid and saves
 * or updates the separate values on that object.
 */
function parseColors() {
    var gridCell, rawRGB;
    numRows = $("#grid-area").children().length;
    numColumns = $("#grid-area").children().first().children().length;
    console.log(numRows + " " + numColumns);

    for (gridRow = 0; gridRow < numRows; gridRow++) {
        for (gridColumn = 0; gridColumn < numColumns; gridColumn++) {
            gridCell = gridArr[gridRow][gridColumn];
            rawRGB = gridCell.css("background-color").split(",");
            gridCell.r = rawRGB[0].trim().slice(rawRGB[0].indexOf("(") + 1, rawRGB[0].length);
            gridCell.g = rawRGB[1].trim();
            gridCell.b = rawRGB[2].trim().slice(0, rawRGB[2].indexOf(")") - 1);
            gridCell.a = rawRGB.length === 4 ? rawRGB[3] : "255";
        }
    }
}

/**
 * Generate (but don't display!) canvas.
 * Then get a data URI/URL for the canvas which can then be applied to the 
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

    for (gridRow = 0; gridRow < numRows; gridRow++) {
        for (gridColumn = 0; gridColumn < numColumns; gridColumn++) {
            var gridCell = gridArr[gridRow][gridColumn];
            colorData[0] = gridCell.r;
            colorData[1] = gridCell.g;
            colorData[2] = gridCell.b;
            colorData[3] = gridCell.a; // alpha
            ctx.putImageData(imgData, gridColumn, gridRow);
        }
    }

    document.body.removeChild(canvas);
    return canvas.toDataURL("image/png");
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

function setErase() {
    color = "transparent";
    $("#color-text").val("erase");
    $("#color-text").css({"background-color": "white", "color": "black"});
}

function eyeDropping() {
    eyeDropper = true;
    $("body").css({"cursor": "copy"});
}

function clearCanvas() {
    $(".wee-div").css({'background-color': 'transparent'});
    initPalette();
}

$("#download-btn").click(function () {
    downloadPNG(generateCanvas());
});

/** Helper method for readability */
function getLastChild() {
    return $("#grid-area").children().last();
}

/** Helper Method for readability */
function getLastGrandchild() {
    return $("#grid-area").children().last().children().last();
}

/**
 * Adds a grid cell as a child to the given parent element, should generally be 
 * a .grid-row.
 * @param Parent element to add grid cell to.
 * @return Returns the jquery object represent the newly created cell.
 */
function addCell(parent) {
    var newCell = parent.append(weeDiv).children().last();
    $(newCell).css({"width": cellSize + "px", "height": cellSize + "px"});
    $(".grid-row").css({"height": cellSize + "px"});
    if(!$("#grid-checkbox").is(":checked")) {
        $(newCell).css({"border": "solid 1px transparent"});
    }
    newCell.mouseover(function () {
        $(this).css({"border": "solid 2px black"});
        if (mouseDown) {
            $(this).css({'background-color': color});
        }
    });
    newCell.mouseleave(function () {
        if($("#grid-checkbox").is(":checked")) {
            $(this).css({"border": "solid 1px black"});
        } else {
            $(this).css({"border": "solid 1px transparent"});
        }
    });
    newCell.mousedown(function () {
        if (!eyeDropper) {
            $(this).css({'background-color': color});
        } else {
            if ($(this).css("background-color") !== "transparent") {
                color = parseRGBtoHex($(this).css("background-color"));
                $("#color-text").val(color.split("#")[1].toUpperCase());
                $("#color-text").css({"background-color": color});
            }
            eyeDropper = false;
            $("body").css({"cursor": "default"});
        }
    });
    $("#dimensions").text("Dimensions: " + $(getLastChild()).children().length + "x" + $("#grid-area").children().length);
    return newCell;
}

function addColumn() {
    for (var i = 0; i < $("#grid-area").children().length; i++) {
        var currentGridRow = $("#grid-area").children()[i];
        gridArr[i].length++;
        gridArr[i][gridArr[i].length - 1] = addCell($(currentGridRow));
    }
}

function addRow() {
    $("#grid-area").append(rowDiv);
    gridArr[gridArr.length++] = new Array(numColumns);
    for (var i = 0; i < $("#grid-area").children().first().children().length; i++) {
        gridArr[gridArr.length - 1][i] = addCell(getLastChild());
    }
}

function removeColumn() {
    for (var i = 0; i < $("#grid-area").children().length; i++) {
        var currentGridRow = $("#grid-area").children()[i];
        $(currentGridRow).children().last().remove();
        gridArr[i].length--;
    }
    $("#dimensions").text("Dimensions: " + $(getLastChild()).children().length + "x" + $("#grid-area").children().length);
}

function removeRow() {
    getLastChild().remove();
    gridArr.length--;
    $("#dimensions").text("Dimensions: " + $(getLastChild()).children().length + "x" + $("#grid-area").children().length);
}
