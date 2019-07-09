(function () {

    var state = 1
    var puzzle = document.getElementById('puzzle')

    //membuat solved puzzle
    selesai()

    //Listens for click on puzzle cells
    puzzle.addEventListener('click', function (e) {
        if (state == 1) {
            //enable sliding animation
            puzzle.className = 'animate'
            shiftCell(e.target)
        }
    })

    // listens for click on control buttons
    document.getElementById('selesai').addEventListener('click', selesai)
    document.getElementById('Acak').addEventListener('click', acak)


    //creates solved puzzle


    function selesai() {

        if (state == 0) {
            return
        }

        puzzle.innerHTML = ''

        var n = 1
        for (var i = 0; i <= 3; i++) {
            for (var j = 0; j <= 3; j++) {
                var cell = document.createElement('span')
                cell.id = 'cell-' + i + '-' + j
                cell.style.left = (j * 80 + 1 * j + 1) + 'px'
                cell.style.top = (i * 80 + 1 * i + 1) + 'px'

                if (n <= 15) {
                    cell.classList.add('number')
                    cell.classList.add((i % 2 == 0 && j % 2 > 0 || i % 2 > 0 && j % 2 == 0) ? 'dark' : 'light')
                    cell.innerHTML = (n++).toString()
                } else {
                    cell.className = 'empty'
                }

                puzzle.appendChild(cell)
            }
        }
    }



    //shift number cell to the empty cell
    function shiftCell(cell) {

        //check if selected cell has number
        if (cell.className != 'empty') {

            //tries to get empty adjacent cell
            var emptyCell = getEmptyAdjacentCell(cell)



            if (emptyCell) {
                //temporary data
                var tmp = {
                    style: cell.style.cssText,
                    id: cell.id
                }

                //Exchange id and style values
                cell.style.cssText = emptyCell.style.cssText
                cell.id = emptyCell.id
                emptyCell.style.cssText = tmp.style
                emptyCell.id = tmp.id

                if (state == 1) {
                    //check the order of numbers
                    checkOrder()
                }
            }
        }
    }


    //gets specific cell by row and column
    function getCell(row, col) {
        return document.getElementById('cell-' + row + '-' + col)
    }


    //get empty cell
    function getEmptyCell() {
        return puzzle.querySelector('.empty')
    }

    //get empty adjacent cell if it exists
    function getEmptyAdjacentCell(cell) {

        //get all adjacent cell
        var adjacent = getAdjacentCell(cell)

        //searches for emppty cell
        for (var i = 0; i < adjacent.length; i++) {
            if (adjacent[i].className == 'empty') {
                return adjacent[i]
            }
        }

        //empty adjacent cell was not found
        return false
    }

    //get all adjacent cells
    function getAdjacentCell(cell) {
        var id = cell.id.split('-')

        //get cell position indexes
        var row = parseInt(id[1])
        var col = parseInt(id[2])

        var adjacent = []

        //get all possible adjacent cells
        if (row < 3) {
            adjacent.push(getCell(row + 1, col))
        }
        if (row > 0) {
            adjacent.push(getCell(row - 1, col))
        }
        if (col < 3) {
            adjacent.push(getCell(row, col + 1))
        }
        if (col > 0) {
            adjacent.push(getCell(row, col - 1))
        }
        return adjacent
    }

    //check if the border of numbers is correct
    function checkOrder() {

        //check if the empty cell is in correct position
        if (getCell(3, 3).className != 'empty') {
            return
        }

        var n = 1
        //goes through all cell and checks numbers
        for (var i = 0; i <= 3; i++) {
            for (var j = 0; j <= 3; j++) {
                if (n <= 15 && getCell(i, j).innerHTML != n.toString()) {
                    //order is not correct
                    return
                }
                n++
            }
        }

        //puzzle is solved, offers to scramble it
        if (confirm('Selamat \n kamu berhasil \n Coba lagi ?')) {
            acak()
        }
    }

    //scramble the puzzle
    function acak() {
        if (state == 0) {
            return
        }

        puzzle.removeAttribute('class')
        state = 0

        var previousCell
        var i = 1
        var interval = setInterval(function () {
            if (i <= 100) {
                var adjacent = getAdjacentCell(getEmptyCell())
                if (previousCell) {
                    for (var j = adjacent.length - 1; j >= 0; j--) {
                        if (adjacent[j].innerHTML == previousCell.innerHTML) {
                            adjacent.splice(j, 1)
                        }
                    }
                }

                //get random adjacent cell and memorized it for the next iteration
                previousCell = adjacent[rand(0, adjacent.length - 1)]
                shiftCell(previousCell)
                i++
            } else {
                clearInterval(interval)
                state = 1
            }
        }, 5)

    }

    //generates random number
    function rand(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from
    }
}())