"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 11
   Tutorial Case

      Author: Todd Adcox Jr
      Date:   3-5-19

   Global Variables
   ================
   
   puzzleCells
      References the TD cells within the Hanjie table grid.
   
   cellBackground
      Stores the current background color of the puzzle
      cells during the mouseover event.
      
      
   Function List
   =============

   init()
      Run when the web page is loaded; displays puzzle 1
      and loads the event handlers for the web page buttons.
      
   setupPuzzle()
      Sets up a new puzzle, adding the event handlers for
      every puzzle cell.      

   swapPuzzle(e)
      Swaps one puzzle for another based on the button being clicked
      by the user. Confirms the change before swapping in the
      new puzzle.

   setBackground(e)
      Sets the background color of the puzzle cells during the mousedown
      event

   extendBackground(e)
      Extends the background color of the original puzzle cell during
      the mouseenter event.
      
   endBackground()
      Ends the action of extending the cell backgrounds in response to the
      mouseup event.

   drawPuzzle(hint, rating, puzzle)
      Returns a text string of the HTML code to
      display a hanjie Web table based on the contents of
      multi-dimensional array, puzzle.
	
*/
// Runs the init function when the page loads.
window.onload = init;

var puzzleCells;
var cellBackground;

function init() {
      // Insert the title for the first puzzle.
      document.getElementById("puzzleTitle").innerHTML = "Puzzle 1";

      // Insert HTML code for the first puzzle table.
      document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);

      // Add event handlers for the puzzle buttons.
      var puzzleButtons = document.getElementsByClassName("puzzles");
      for (var i = 0; i < puzzleButtons.length; i++) {
            puzzleButtons[i].onclick = swapPuzzle;
      }
      setupPuzzle();


      // Add an event listener for the mouseup event.
      document.addEventListener("mouseup", endBackground);

      // Add an event listener to the show solution button.
      document.getElementById("solve").addEventListener("click", function () {
            // Removing the inline background color from each cell.
            for (var i = 0; i < puzzleCells.length; i++) {
                  puzzleCells[i].style.backgroundColor = "";
            }
      });
}

function swapPuzzle(e) {
      if (confirm("You will lose all of your work on the puzzle! Continue?")) {

            // Retrieves the ID of the clicked button.
            var puzzleID = e.target.id;

            // Retrieves the value of the clicked button.
            var puzzleTitle = e.target.value;
            document.getElementById("puzzleTitle").innerHTML = puzzleTitle;

            // Displays the puzzle based on the value of the puzzleID variable.
            switch (puzzleID) {
                  case "puzzle1":
                        document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);
                        break;
                  case "puzzle2":
                        document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle2Hint, puzzle2Rating, puzzle2);
                        break;
                  case "puzzle3":
                        document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle3Hint, puzzle3Rating, puzzle3);
                        break;
            }
            setupPuzzle();
      }
}

function setupPuzzle() {
      // Match all of the data cells in the puzzle.
      puzzleCells = document.querySelectorAll("table#hanjieGrid td");

      // Set the initial color of each cell to gold.
      for (var i = 0; i < puzzleCells.length; i++) {
            puzzleCells[i].style.backgroundColor = "rgb(233, 207, 29)";

            // Set the cell background-color in response to the mousedown event.
            puzzleCells[i].onmousedown = setBackground;

            // Use a pencil image as the cursor.
            puzzleCells[i].style.cursor = "url(jpf_pencil.png), pointer";
      }
      // Create object collection of the filled an empty cells.
      var filled = document.querySelectorAll("table#hanjieGrid td.filled");
      var empty = document.querySelectorAll("table#hanjieGrid td.empty");

      // Create an event listener to highlight incorrect cells.
      document.getElementById("peek").addEventListener("click", function () {
            // Displays incorrect white cells in pink.
            for (var i = 0; i < filled.length; i++) {
                  if (filled[i].style.backgroundColor === "rgb(255, 255, 255)") {
                        filled[i].style.backgroundColor = "rgb(255, 211, 211)";
                  }
            }
            // Display incorrect cells as red.
            for (var i = 0; i < empty.length; i++) {
                  if (empty[i].style.backgroundColor === "rgb(101, 101, 101)") {
                        empty[i].style.backgroundColor = "rgb(255, 101, 101)";
                  }
            }

            // Remove the hints after 0.5 seconds.
            setTimeout(
                  function () {
                        // Change pink cells to white and red cells to gray.
                        for (var i = 0; i < puzzleCells.length; i++) {
                              if (puzzleCells[i].style.backgroundColor === "rgb(255, 211, 211)") {
                                    puzzleCells[i].style.backgroundColor = "rgb(255, 255, 255)";
                              }
                              if (puzzleCells[i].style.backgroundColor === "rgb(255, 101, 101)") {
                                    puzzleCells[i].style.backgroundColor = "rgb(101, 101, 101)";
                              }
                        }
                  }, 500);
      });
      // Check the puzzle solution.
      document.getElementById("hanjieGrid").addEventListener("mouseup", function () {
            var solved = true;
            for (var i = 0; i < puzzleCells.length; i++) {
                  if ((puzzleCells[i].className === "filled" && puzzleCells[i].style.backgroundColor !== "rgb(101, 101, 101)") || (puzzleCells[i].className === "empty" && puzzleCells[i].style.backgroundColor === "rgb(101, 101, 101)")) {
                        solved = false;
                        break;
                  }
            }
            if (solved) {
                  alert("You solved the PUZZLE!")
            }
      });
}

function setBackground(e) {
      var cursorType;
      // cellBackground = "rgb(101, 101, 101)";
      // Set the background based on the keyboard key
      if (e.shiftKey) {
            cellBackground = "rgb(233, 207, 29)";
            cursorType = "url(jpf_eraser.png), cell";
      } else if (e.altKey) {
            cellBackground = "rgb(255, 255, 255)";
            cursorType = "url(jpf_cross.png), crosshair";
      } else {
            cellBackground = "rgb(101, 101, 101)";
            cursorType = "url(jpf_pencil.png), pointer";
      }
      e.target.style.backgroundColor = cellBackground;

      // Create an event listener for every cell
      for (var i = 0; i < puzzleCells.length; i++) {
            puzzleCells[i].addEventListener("mouseenter", extendBackground);
            puzzleCells[i].style.cursor = cursorType;

      }
      // Prevent the default action of selecting table text.
      e.preventDefault();
}

// Create a function to extend the background and set a new background-color.
function extendBackground(e) {
      e.target.style.backgroundColor = cellBackground;
}

function endBackground() {

      //remove the event listener for every puzzle cell.
      for (var i = 0; i < puzzleCells.length; i++) {
            puzzleCells[i].removeEventListener("mouseenter", extendBackground);
      }
}


/* ================================================================= */

function drawPuzzle(hint, rating, puzzle) {

      /* Initial HTML String for the Hanjie Puzzle */
      var htmlString = "";

      /* puzzle is a multidimensional array containing the
         Hanjie puzzle layout. Marked cells are indicated by
         the # character. Empty cells are indicated by an
         empty text string. First, determine the number of rows
         and columns in the puzzle */

      var totalRows = puzzle.length;
      var totalCols = puzzle[0].length;

      /* Loop through the rows to create the rowCount array
         containing the totals for each row in the puzzle */

      var rowCount = [];
      var spaceCount;
      for (var i = 0; i < totalRows; i++) {
            rowCount[i] = "";
            spaceCount = 0;

            for (var j = 0; j < totalCols; j++) {
                  if (puzzle[i][j] === "#") {
                        spaceCount++;
                        if (j === totalCols - 1) {
                              rowCount[i] += spaceCount + "&nbsp;&nbsp;";
                        }
                  } else {
                        if (spaceCount > 0) {
                              rowCount[i] += spaceCount + "&nbsp;&nbsp;";
                              spaceCount = 0;
                        }
                  }
            }

      }

      /* Loop through the columns to create the colCount array
         containing the totals for each column in the puzzle */

      var colCount = [];
      for (var j = 0; j < totalCols; j++) {
            colCount[j] = "";
            spaceCount = 0;

            for (var i = 0; i < totalRows; i++) {
                  if (puzzle[i][j] === "#") {
                        spaceCount++;
                        if (i === totalRows - 1) {
                              colCount[j] += spaceCount + "<br />";
                        }
                  } else {
                        if (spaceCount > 0) {
                              colCount[j] += spaceCount + "<br />";
                              spaceCount = 0;
                        }
                  }
            }

      }

      /* Create a Web table with the id, hanjieGrid, containing
         headers with the row and column totals.
         Each marked cell has the class name, marked; each
         empty cell has the class name, empty */

      htmlString = "<table id='hanjieGrid'>";
      htmlString += "<caption>" + hint + " (" + rating + ")</caption>";
      htmlString += "<tr><th></th>";

      for (var j = 0; j < totalCols; j++) {
            htmlString += "<th class='cols'>" + colCount[j] + "</th>";
      }
      htmlString += "</tr>";

      for (var i = 0; i < totalRows; i++) {
            htmlString += "<tr><th class='rows'>&nbsp;" + rowCount[i] + "</th>";

            for (var j = 0; j < totalCols; j++) {
                  if (puzzle[i][j] === "#") {
                        htmlString += "<td  class='filled'></td>";
                  } else {
                        htmlString += "<td class='empty'></td>";
                  }
            }

            htmlString += "</tr>";
      }

      htmlString += "</table>";

      return htmlString;
}