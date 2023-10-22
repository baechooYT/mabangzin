import * as React from "react";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

type SizeAttr = {
    size?: number
}

const GridItem = styled.input<SizeAttr>`
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.8);
  height: calc(100% - 1px);
  width: calc(100% - 5px);
  font-size: ${({ size }) => `calc(${22.5/size}vh + ${22.5/size}vh)`};
  text-align: center;
`;

const GridContainer = styled.div<SizeAttr>`
  display: grid;
  grid-template-columns: ${({ size }) => `repeat(${size}, 1fr)`};
  background-color: #2196f3;
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



const App: React.FC = () => {
    useEffect(() => {
        document.title = '마방진 v0.1';
    }, []);

    const [size, setSize] = useState("");

    const containerRef = useRef(null);

    const sizeChange = (e: any) => {
        const newSize = e.target.value;
        if (!isNaN(newSize) && newSize >= 0 && newSize <= 22) {
            setSize(newSize);
        }
    };

    const generateGridItems = (size: number) => {
        const gridItems = [];

        for (let i = 0; i < size * size; i++) {
            gridItems.push(<GridItem key={i} size={size}/>);
        }

        return gridItems;
    };

    return (
        <main>
            <GridContainer ref={containerRef} size={size}>
                {generateGridItems(Number(size))}
            </GridContainer>

            <SizeInput id="size1" value={size} onChange={sizeChange}></SizeInput>
            <BasicText> x </BasicText>
            <SizeInput id="size2" value={size} onChange={sizeChange}></SizeInput>
        </main>
    );
};

export default App;
