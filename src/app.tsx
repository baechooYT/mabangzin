import * as React from "react";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

type SizeAttr = {
    size?: number
}

type GridAttr = {
    col?: number | boolean,
    row?: number | boolean,
    size?: number
}

const GridItem = styled.input<GridAttr>`
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.8);
  height: calc(100% - 1px);
  width: calc(100% - 5px);
  font-size: ${({ size }) => `calc(29vmin / ${size})`};
  text-align: center;
`;

const GridContainer = styled.div<SizeAttr>`
  display: grid;
  grid-template-columns: ${({ size }) => `repeat(${size}, 1fr)`};
  background-color: rgb(33, 150, 243);
  padding: 10px;
  height: 70vh;
  width: 70vw;
`;

const SizeInput = styled.input`
  width: 6vw;
  font-size: calc(2vw + 2vh);
`;

const BasicText = styled.a`
  font-size: calc(2vw + 2vh);
  color: white;
`;

const BasicButton = styled.button`
  width: 6vw;
  height: 6.5vh;
  font-size: calc(1.25vw + 1.25vh);
`

const BasicDropdown = styled.select`
  width: 15vw;
  height: 6.5vh;
  font-size: calc(1.25vw + 1.25vh);
`

const App: React.FC = () => {
    useEffect(() => {
        document.title = '마방진 v0.3';
    }, []);

    const [size, setSize] = useState("");

    const containerRef = useRef(null);

    const [squareData, setSquareData] = useState([])
    const sizeChange = (e: any) => {
        setSquareData([])
        containerRef.current.style.backgroundColor = "rgb(33, 150, 243)";
        const newSize = e.target.value;
        if (!isNaN(newSize) && newSize >= 0 && newSize <= 54) {
            setSize(newSize);
        }
    };

    const isCorrectSquare = (data: [[number]]) => {
        if (data.length != Number(size)) {
            return false;
        }

        for (let i = 0; i < data.length; i++) {
            if(!data[i] || typeof data[i] != "object" || data[i].length != Number(size)){
                return false;
            }
            for (let j = 0; j < data[i].length; j++) {
                if(!data[i][j] || typeof data[i][j] != "number"){
                    return false;
                }
            }
        }

        const usedNums: number[] = []
        let firstRowSum = 0;
        for (let i = 0; i < data.length; i++) {
            let rowSum = 0;
            for (let j = 0; j < data[i].length; j++) {
                rowSum += data[i][j];

                if(usedNums.find((element) => element == data[i][j])){
                    return false
                }else{
                    usedNums.push(data[i][j])
                }
            }

            if (i === 0) {
                firstRowSum = rowSum;
            } else {
                console.log(rowSum, firstRowSum);
                if (rowSum !== firstRowSum) {
                    return false;
                }
            }
        }

        const colSums: number[] = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if(!colSums[j]){
                    colSums[j]=0
                }
                colSums[j] = colSums[j] + data[i][j];
            }
        }

        const firstColSum = colSums[0]
        for (let i = 0; i < colSums.length; i++){
            if(firstColSum != colSums[i]){
                return false
            }
        }

        let diagonalSum = 0
        for (let i = 0; i < data.length; i++) {
            diagonalSum += data[i][i]
        }

        if (diagonalSum != firstColSum || diagonalSum != firstRowSum){
            return false
        }

        let diagonalSum2 = 0
        for (let i = data.length-1; i > data.length; i--) {
            diagonalSum2 += data[i][i]
        }

        if (diagonalSum != firstColSum || diagonalSum != firstRowSum){
            return false
        }

        return true;
    };


    const gridItemChanged = (e: any) => {
        const newValue = e.target.value;

        if (!squareData[e.target.getAttribute("row") - 1]) {
            squareData[e.target.getAttribute("row") - 1] = []
        }

        squareData[e.target.getAttribute("row") - 1][e.target.getAttribute("col") - 1] = Number(newValue)

        if (squareData.length != e.target.size) {
            containerRef.current.style.backgroundColor = "rgb(33, 150, 243)";
            return;
        }

        for (let i = 0; i < squareData.length; i++) {
            if(!squareData[i] || typeof squareData[i] != "object" || squareData[i].length != e.target.size){
                containerRef.current.style.backgroundColor = "rgb(33, 150, 243)";
                return
            }
            for (let j = 0; j < squareData[i].length; j++) {
                if(!squareData[i][j] || typeof squareData[i][j] != "number"){
                    containerRef.current.style.backgroundColor = "rgb(33, 150, 243)";
                    return;
                }
            }
        }

        const correctSquare = isCorrectSquare(squareData as [[number]]);

        // Set the background color of the GridContainer based on isCorrectSquare result
        if (correctSquare) {
            containerRef.current.style.backgroundColor = "green";
        } else {
            containerRef.current.style.backgroundColor = "red";
        }
    }
    const generateGridItems = (size: number) => {
        const gridItems = [];

        for (let i = 0; i < size * size; i++) {
            const item = <GridItem key={i} size={size} row={Math.floor(i / size) + 1} col={(i+1)%size == 0 ? size : (i+1)%size} onChange={gridItemChanged}/>
            gridItems.push(
                item
            );
        }

        return gridItems;
    };

    const oddSquareSolve = async () => {
        const data: any[] = []
        const squareSize = Number(size)
        for (let i=0;i<squareSize;i++){
            data[i] = []
            for (let j=0;j<squareSize;j++){
                data[i][j] = 0
            }
        }

        let col = (squareSize-1)/2
        let row = 0
        data[0][col] = 1

        for (let i=0;i<(squareSize*squareSize)-1;i++){
            const prevCol = col
            const prevRow = row
            row-=1
            col+=1
            if (row<=-1){
                row = squareSize-1
            }
            if (col>=squareSize){
                col = 0
            }

            if(data[row][col] != 0){
                row=prevRow+1
                col=prevCol
            }

            data[row][col] = i+2
        }

        const gridContainer = document.getElementById("gridContainer")
        for(let i=0;i<gridContainer.children.length;i++){
            (gridContainer.children[i] as any).value = data[Number(gridContainer.children[i].getAttribute("row"))-1][Number(gridContainer.children[i].getAttribute("col"))-1]
            gridItemChanged({target:gridContainer.children[i]})
        }
    }

    const DoublyEvenSquareSolve = async () => {
        const data: any[] = []
        const squareSize = Number(size)
        for (let i=0;i<squareSize;i++){
            data[i] = []
            for (let j=0;j<squareSize;j++){
                data[i][j] = 0
            }
        }

        let i = 1
        for (let row=0;row<squareSize;row++){
            for (let col = 0; col < squareSize; col++) {
                if ((col) % 4 == 0 || (col + 1) % 4 == 0) {
                    data[row][col] = ((row) % 4 == 0 || (row + 1) % 4 == 0) ? i : (squareSize * squareSize) - i + 1
                } else {
                    data[row][col] = ((row) % 4 == 0 || (row + 1) % 4 == 0) ? (squareSize * squareSize) - i + 1 : i
                }
                i++
            }
        }

        const gridContainer = document.getElementById("gridContainer")
        for(let i=0;i<gridContainer.children.length;i++){
            (gridContainer.children[i] as any).value = data[Number(gridContainer.children[i].getAttribute("row"))-1][Number(gridContainer.children[i].getAttribute("col"))-1]
            gridItemChanged({target:gridContainer.children[i]})
        }
    }

    const SinglyEvenSquareSolve = async () => {
        function fillQuarterOfSinglyEvenOrder(magicSquare: any, firstRow: any, lastRow: any, firstCol: any, lastCol: any, num: any, lastNum: any) {
            // Initialize position for 1st number:
            let i = firstRow;
            let j = Math.floor((lastCol + firstCol)/2);

            // One by one put all values in magic square
            while(num <= lastNum) {
                // 4th condition:
                if (i < firstRow && j >= lastCol) {
                    i += 2;
                    j--;
                }
                // 2nd condition:
                // If next number goes to out of square's right side
                if (j >= lastCol) j = firstCol;
                // 1st condition:
                // If next number goes to out of square's upper side
                if (i < firstRow) i = lastRow - 1;
                // 3rd condition:
                if (magicSquare[i][j] !== 0) {
                    i += 2;
                    j--;
                    continue;
                }
                else {
                    // Add num to cell:
                    magicSquare[i][j] = num;
                    // Increment num to next one:
                    num++;
                }
                i--;
                j++;
            }
        }

        function exchangeCell(i: any, j: any, matrix: any) {
            const n = matrix.length;
            const r = Math.floor(n/2) + i;
            const temp = matrix[i][j];
            matrix[i][j] = matrix[r][j];
            matrix[r][j] = temp;
        }

        const data: any[] = []
        const squareSize = Number(size)
        for (let i=0;i<squareSize;i++){
            data[i] = []
            for (let j=0;j<squareSize;j++){
                data[i][j] = 0
            }
        }

        // Top left:
        fillQuarterOfSinglyEvenOrder(data, 0, squareSize/2, 0, squareSize/2, 1, (squareSize/2)*(squareSize/2));
        // Bottom right:
        fillQuarterOfSinglyEvenOrder(data, squareSize/2, squareSize, squareSize/2, squareSize, (squareSize/2)*(squareSize/2) + 1, squareSize*squareSize/2);
        // Top right:
        fillQuarterOfSinglyEvenOrder(data, 0, squareSize/2, squareSize/2, squareSize, squareSize*squareSize/2 + 1, 3*(squareSize/2)*(squareSize/2));
        // Bottom left:
        fillQuarterOfSinglyEvenOrder(data, squareSize/2, squareSize, 0, squareSize/2, 3*(squareSize/2)*(squareSize/2) + 1, squareSize*squareSize);

        const shiftCol = (squareSize/2 - 1)/2;
        let i, j;
        // Exchange columns in left quarters:
        for (i = 0; i < Math.floor(squareSize/2); i++) {
            for (j = 0; j < shiftCol; j++) {
                // If we're at middle row of top left quarter, shift 1 to the right:
                if (i === Math.floor(squareSize/4)) {
                    exchangeCell(i, j + shiftCol, data);
                }
                else exchangeCell(i, j, data);
            }
        }
        // Exchange columns right quarters if n > 6:
        for (i = 0; i < Math.floor(squareSize/2); i++) {
            for (j = squareSize - 1; j > squareSize - shiftCol; j--) {
                exchangeCell(i, j, data);
            }
        }

        const gridContainer = document.getElementById("gridContainer")
        for(let i=0;i<gridContainer.children.length;i++){
            (gridContainer.children[i] as any).value = data[Number(gridContainer.children[i].getAttribute("row"))-1][Number(gridContainer.children[i].getAttribute("col"))-1]
            gridItemChanged({target:gridContainer.children[i]})
        }
    }

    const solve = () => {
        const solveMethod = document.getElementById("solveMethod")
        if ((solveMethod as any).value == "홀수 차수"){
            oddSquareSolve()
        }else if ((solveMethod as any).value == "4k 마방진"){
            DoublyEvenSquareSolve()
        }else if ((solveMethod as any).value == "4k+2 마방진"){
            SinglyEvenSquareSolve()
        }
    }

    const getSolveOptions = () => {
        const options = [];

        if (Number(size) == 2 || Number(size) == 0){
            return []
        }

        if (Number(size) % 2 != 0){
            options.push(<option>홀수 차수</option>)
        }else if (Number(size) % 4 == 0){
            options.push(<option>4k 마방진</option>)
        }else if ((Number(size)-2) % 4 == 0){
            options.push(<option>4k+2 마방진</option>)
        }

        return options;
    }

    return (
        <main>
            <GridContainer id="gridContainer" ref={containerRef} size={Number(size)}>
                {generateGridItems(Number(size))}
            </GridContainer>

            <SizeInput id="size1" value={size} onChange={sizeChange}></SizeInput>
            <BasicText> x </BasicText>
            <SizeInput id="size2" value={size} onChange={sizeChange}></SizeInput>

            <BasicButton style={{ float: 'right' }} onClick={solve}>풀기</BasicButton>
            <BasicDropdown id="solveMethod" name="푸는 방법" style={{ float: 'right' }}>
                {getSolveOptions()}
            </BasicDropdown>
        </main>
    );
};

export default App;
