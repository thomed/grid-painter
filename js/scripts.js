/**
 * TODO
 * Client-side PNG generation. library or proprietary data URI magic?
 * http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
 */

// ingredients
var col = 1, row = 1;
var numColumns = 20, numRows = 20;
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
    
// rgb color info parsing 
// TODO probably do something along these lines to store rgb info with each grid element
//      then write to location on canvas
    console.log(gridArr[0][19].css("background-color"));
    gridArr[0][19].backgroundColor = gridArr[0][19].css("background-color").slice(4, 7) + gridArr[0][19].css("background-color").slice(9, 12) + gridArr[0][19].css("background-color").slice(14, 17);
    var rawRGB = gridArr[0][19].css("background-color").split(",");
    gridArr[0][19].r = rawRGB[0].trim().slice(rawRGB[0].indexOf("(") + 1, rawRGB[0].length);
    gridArr[0][19].g = rawRGB[1].trim();
    gridArr[0][19].b = rawRGB[2].trim().slice(0, rawRGB[2].indexOf(")") - 1);
    console.log(gridArr[0][19].r + " " + gridArr[0][19].g + " " + gridArr[0][19].b);
// end rgb format prototyping
// probably best to stick with this kind of a method, at least for initial implementation.

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

// URI and Download experimentation
// ================================
// Currently generates and downloads a .png file with a single, hardcoded pixel.
// 
// TODO 
// implement hex -> base64 conversion for colors. 
// Figure out how base64 image data is organized/written/interpreted.
// 
// >>>> These links have good information on how PNGs are written <<<<
// >>>> http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html <<<<
// >>>> https://www.w3.org/TR/PNG-Chunks.html <<<< chunks
//
// look into using btoa() or atob()?
// 
// alternate solution: draw to a hidden canvas then return canvas.toDataURL()
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// probably the simplest out of the other solutions, but not as neat.
function generateURI() {
    var headerInfo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA";
    return headerInfo + "EAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY7D3OAMAAh0BVEDFEogAAAAASUVORK5CYII=";
}

function downloadPNG(uri) {
    var link = document.createElement("a");
    link.download = "asdf.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
    console.log(uri);
}

// generate (but don't display!) canvas.
// then get a data URI/URL for the canvas which can then be applied to the 
// download link
function generateCanvas() {
    var canvas = document.createElement("canvas");
    canvas.width = numColumns;
    canvas.height = numRows;
    document.body.appendChild(canvas);

    return canvas.toDataURL("image/png");
}

$("#download-btn").click(function () {
    downloadPNG(generateURI());
});

// end experimenting