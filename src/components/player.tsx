import React, {useState, useContext, useEffect} from 'react';
import ReactSVG from 'react-svg';
import styled,{keyframes} from "styled-components";
import PlayerContext from '../context/player-info';
import { css } from 'glamor'

const Symbol = styled.div`
  width: 50px
  fill: #aaa;
  height: 50px;
  `;
const Player: React.FC = () => {

    const [ direction, setDirection ] = useState('right');
    const [style, setStyle] = useState(css({
    }));
    const [gameOver, isGameOver] = useState(false);
    const [gameRunning, changeGameStatus] = useState(true);
    const [win, isWin] = useState(false);
    var positions = {
      x:0,
      y:0
    }
    let finishLine;
    let moveRight,moveLeft;

    function changeDirection(event) {
      positions.y = getPositions('runningMan')['y'];
      finishLine = getPositions('finish')['x'];
      if (event.keyCode == '39') {
        setDirection('right');
        clearInterval(moveLeft);
        moveLeft = null;
        if(!moveRight){
          moveRight = setInterval(function(){
            if(positions.x > document.body.clientWidth-50){
              clearInterval(moveRight);
            }
            positions.x += 1;
            moveObject(positions.x);
          },10)
        }
      }
      if (event.keyCode == '37') {
        setDirection('left')
        clearInterval(moveRight);
        moveRight = null;
          if(!moveLeft){
            moveLeft = setInterval(function(){
              if(positions.x <= 0){
                clearInterval(moveLeft);
              }
              positions.x -= 1;
              moveObject(positions.x);
            },10)
          }
      }
    }
    
    function moveObject(i){
      setStyle(css({
        ' svg': {
          transform: `translateX(${i}px)`
        },
      }));
      checkForOverLapping(positions.x,positions.y);
      checkForVictory(i);
    }
    
    function checkForOverLapping(x,y){
      let elements = document.querySelectorAll('.missle')
      if(elements){
        elements.forEach(ele=>{
          let elePos = ele.getBoundingClientRect();
          if(parseInt(elePos['y']) == 167){
          }
          if(isAroundArea(x,parseInt(elePos['x']),20,30) && isAroundArea(y,parseInt(elePos['y']),0,50)){
              isGameOver(true);
              changeGameStatus(false);
              clearInterval(moveRight);
              clearInterval(moveLeft);
            }
        })
      }
    }

    function checkForVictory(x){
      if(x == parseInt(finishLine)){
        isWin(true);
        changeGameStatus(false);
      }
    }

    function getPositions(selector){
      let element = document.getElementById(selector);
      if(element){
        return element.getBoundingClientRect();
      }
      return {}
    }

    function isAroundArea(playerPos,missilePos,xRange,yRange){
      if(playerPos <= missilePos+xRange && playerPos >= missilePos-yRange){
        return true
      }
    }

    useEffect(() => {
      onkeydown = changeDirection;
    }, []);
 
    return (
      <div> 
            {gameRunning ? 
      <Symbol>
          <ReactSVG  {...style} id='runningMan'
              src="running-man.svg"
            /> 
      </Symbol>: 
            gameOver ? 
              <div className='result'>
                <h1>Game Is Over</h1>
              </div>  
                :
                <div className='result'>
                    <h1>Winner winner chicken dinner</h1>
              </div>
            }
      </div>
    );
}

export default Player;
