/**
 * TODO:
 * - Grid dimensions option
 * - Various UI improvements
 * - Color picker tool (dropper)
 * - Eraser & Transparency
 * - Recently used colors palette
 * - Possibly add ruler or other kind of spacial reference
 * - Make transparent cells perceptible
 * 
 * Stretch goals:
 * - Additional drawing tools
 * - Exported image scaling
 * - Undo / Redo
 */

// ingredients
var numColumns = 32, numRows = 32;
var col = 1, row = 1;
var mouseDown = false;
var color = "#00f";
var gridArr, paletteArr;

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
            $(".wee-div").css({"height": ui.value + "px", "width": ui.value + "px"});
            $(".grid-row").css({"height": ui.value + "px"});
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
        $(this).mousedown(function () {
            $(this).css({'background-color': color});
        });
    });
}

function initPalette() {
    paletteArr = [];
    addPaletteColor("black");
    addPaletteColor("grey");
    addPaletteColor("white");
    addPaletteColor("red");
    addPaletteColor("green");
    addPaletteColor("blue");
    addPaletteColor("yellow");
}

function addPaletteColor(c) {
    if(paletteArr.length % 7 === 0 || paletteArr.length === 0) {
        $("#palette").append("<tr></tr>");
    }
    var newPaletteCell = $("#palette").children().last().append("<td></td>").children().last();
    newPaletteCell.css({"background-color": c});
    paletteArr.push(newPaletteCell);
    newPaletteCell.click(function() {
       color = parseRGBtoHex(newPaletteCell.css("background-color")); 
       $("#color-text").val(color.split("#")[1].toUpperCase());
       $("#color-text").css({"background-color": color});
    });
}

// could possibly separate into more than one function for readability
function parseRGBtoHex(o) {
    var rawRGB = o.split("(")[1].split(")")[0];
    rawRGB = rawRGB.split(",");
    var hex = rawRGB.map(function(c) {
        c = parseInt(c).toString(16);
        return (c.length === 1) ? "0" + c : c;
    });
    
    //console.log("#" + hex.join(""));
    
    return("#" + hex.join(""));
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
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var imgData = ctx.createImageData(numColumns, numRows);
    var colorData = imgData.data;
    canvas.width = numColumns;
    canvas.height = numRows;
    document.body.appendChild(canvas);

    parseColors();
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
    $("#color-text").css({"background-color": "transparent", "color": "black"});
}

function clearCanvas() {
    $(".wee-div").css({'background-color': 'transparent'});
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
