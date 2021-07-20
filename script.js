document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const scoreDisplay = document.getElementById('score');
    const items = [];
    const width = 8;
    const itemColors = [
        'red',
        'pink',
        'yellow',
        'green',
        'blue',
        'purple'
    ];
    let score = 0;

    function createLevel() {
        for(let i = 0; i<width*width; i++) {
            const item = document.createElement('div');
            item.setAttribute('draggable', true);
            item.setAttribute('id', i);
            let randomItemColor = Math.floor(Math.random() * itemColors.length);
            item.style.backgroundColor = itemColors[randomItemColor];
            container.appendChild(item);
            items.push(item);
        }
    }
    createLevel();
    
    let itemColorBeingDragged;
    let itemColorBeingReplaced;
    let itemIdBeingDragged;
    let itemIdBeingReplaced;

    items.forEach(item => item.addEventListener('dragstart', dragStart));
    items.forEach(item => item.addEventListener('dragend', dragEnd));
    items.forEach(item => item.addEventListener('dragover', dragOver));
    items.forEach(item => item.addEventListener('dragenter', dragEnter));
    items.forEach(item => item.addEventListener('drageleave', dragLeave));
    items.forEach(item => item.addEventListener('drop', dragDrop));

    function dragStart(){
        itemColorBeingDragged = this.style.backgroundColor;
        itemIdBeingDragged = parseInt(this.id);
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function dragEnter(e) {
        e.preventDefault();
    }
    
    function dragLeave() {
        this.style.backgroundColor = '';
    }
    
    function dragDrop() {
        itemColorBeingReplaced = this.style.backgroundColor;
        itemIdBeingReplaced = parseInt(this.id);
        this.style.backgroundColor = itemColorBeingDragged;
        items[itemIdBeingDragged].style.backgroundColor = itemColorBeingReplaced;
    }
    
    function dragEnd() {
        let validMoves = [itemIdBeingDragged - 1, itemIdBeingDragged - width, itemIdBeingDragged + 1, itemIdBeingDragged + width];
        let validMove = validMoves.includes(itemIdBeingReplaced);
        if (itemIdBeingReplaced && validMove) {
            itemIdBeingReplaced = null;
        }  else if (itemIdBeingReplaced && !validMove) {
           items[itemIdBeingReplaced].style.backgroundColor = itemColorBeingReplaced;
           items[itemIdBeingDragged].style.backgroundColor = itemColorBeingDragged;
        } else  
            items[itemIdBeingDragged].style.backgroundColor = itemColorBeingDragged;
    }

    function moveIntoSquareBelow() {
        for (i = 0; i < 55; i ++) {
            if(items[i + width].style.backgroundColor === '') {
                items[i + width].style.backgroundColor = items[i].style.backgroundColor
                items[i].style.backgroundColor = ''
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && (items[i].style.backgroundColor === '')) {
                  let randomItemColor = Math.floor(Math.random() * itemColors.length)
                  items[i].style.backgroundColor = itemColors[randomItemColor]
                }
            }
        }
    }

    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = items[i].style.backgroundColor;
            const isBlank = items[i].style.backgroundColor === '';

            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notValid.includes(i)) continue

            if (rowOfThree.every(index => items[index].style.backgroundColor === decidedColor && !isBlank)) {
                score += 3
                scoreDisplay.innerHTML = score
                rowOfThree.forEach(index => {
                    items[index].style.backgroundColor = ''
                })
            }
        }
    }
    checkRowForThree()

    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2]
            let decidedColor = items[i].style.backgroundColor
            const isBlank = items[i].style.backgroundColor === ''

            if (columnOfThree.every(index => items[index].style.backgroundColor === decidedColor && !isBlank)) {
                score += 3
                scoreDisplay.innerHTML = score
                columnOfThree.forEach(index => {
                    items[index].style.backgroundColor = ''
                })
            }
        }
    }
    checkColumnForThree()

    window.setInterval(function () {
        checkRowForThree()
        checkColumnForThree()
        moveIntoSquareBelow()
    }, 100);

})