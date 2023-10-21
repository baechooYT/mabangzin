import * as React from "react";

import styled from "styled-components";
import {useEffect} from "react";

const GridItem = styled.input`
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.8);
  height: calc(100% - 1px);
  width: calc(100% - 5px);
  font-size: calc(3.5vw + 3.5vh);
  font-stretch: ultra-expanded;
  text-align: center;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  background-color: #2196F3;
  padding: 10px;
  height: 70vh;
  width: 70vw;
`

const App: React.FC = () => {
    useEffect(() => {
        document.title = '마방진 v0.1';
    }, []);

    return (
        <main>
            <GridContainer>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
            </GridContainer>
        </main>
    )
}

export default App;
