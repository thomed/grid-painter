/**
 * TODO
 * Client-side PNG generation. library or proprietary data URI magic?
 * http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
 */

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

    $("#scale-slider").slider({
        value: 10,
        min: 8,
        max: 40,
        slide: function (event, ui) {
            $(".wee-div").css({"height": ui.value + "px", "width": ui.value + "px"});
            $(".grid-row").css({"height": ui.value + "px"});
        }
    });

    $("#grid-checkbox").change(function () {
        if (!$("#grid-checkbox").is(":checked")) {
            $(".wee-div").css({"border": "none"});
        } else {
            $(".wee-div").css({"border": "solid 1px black"});
        }
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

// URI and Download experimentation
// ================================
// Currently generates and downloads a .png file with a single, hardcoded pixel.
// 
// TODO 
// implement hex -> base64 conversion for colors. 
// Figure out how base64 image data is organized/written/interpreted.
//
function generateURI() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAM/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAILsEIsAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAACklEQVQYV2NgAAAAAgABo9o9lAAAAABJRU5ErkJggg=="
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

$("#download-btn").click(function() {
    downloadPNG(generateURI());
});

// end experimenting