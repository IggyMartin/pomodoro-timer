import React, { useEffect, useRef, useState } from 'react'
import sound from './assets/build_testable-projects-fcc_audio_BeepSound.wav'
import './App.css'
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { HiMiniPlayPause } from "react-icons/hi2";
import { VscDebugRestart  } from "react-icons/vsc";

// component to set time in minutes
function TimerSetter({minutes, minSetter} : {
  minutes: number,
  minSetter: React.Dispatch<React.SetStateAction<number>>
}) {

  const incremental = () => {
    if(minutes < 60) minSetter(prevState => prevState + 1)
  }

  const decremental = () => {
    if(minutes > 1) minSetter(prevState => prevState - 1)
  }

  return (
    <div className='functionality'>
        <FaArrowDown onClick={() => decremental()} />
      <span className='title' style={{
        margin: '0 15px'
      }}>{minutes}</span>
        <FaArrowUp onClick={() => incremental()} />
    </div>
  )
}

function App() {

  const [workMin, setWorkMin] = useState(25) // workMin and breakMin are used to set the time in muntes for work/study and break time
  const [breakMin, setBreakMin] = useState(5)
  const [workSec, setWorkSec] = useState(workMin * 60) //workSec and breakSec: the minutes time in seconds.
  const [breakSec, setBreakSec] = useState(breakMin * 60)
  const [onBreak, setOnBreak] = useState(false) // state to set if a user is on break time or not
  const [runTimer, setRunTimer] = useState(false) // state used to play and pause timer
  const audioRef = useRef<HTMLAudioElement>(null) // reference to our audio HTML element used to play sound when the timer ends

  //function to toggle the timer to make it run or stop
  function handleTimer() { 
    setRunTimer(prevValue => !prevValue)
  }

  // function which resets the timer
  function handleRestart() {
    setRunTimer(false)
    setOnBreak(false)
    audioRef.current?.pause()
    setWorkSec(workMin * 60)
    setBreakSec(breakMin * 60)
  }

  //function used to display time as: mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0') // make the time in seconds to minutes
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0') // make seconds display from 00 to 59 
    return `${minutes}:${remainingSeconds}`
  }

  const playAudio = () => {
    audioRef.current?.play()
  }

  useEffect(() => {
    let intervalId: number

    if(runTimer) { // if our timer is on play we execute the inner setInterval function which will execute every 1 second
      intervalId = setInterval(() => {
        if(onBreak) { // check whether we are on break or study/work time
          setBreakSec(prevTime => { // every second we'll decrease one second from the current timer
            if(prevTime > 0) return prevTime - 1
            setOnBreak(false) // once timer reaches 0 we'll switch to work time
            playAudio() // play beep sound indicating break time ended
            return breakMin * 60 // set break time again to original seconds time
          })
        } else { // same as above but this 'else' being the work/study time
          setWorkSec(prevTime => {
            if(prevTime > 0) return prevTime - 1
            setOnBreak(true)
            playAudio()
            return workMin * 60
          })
        }
      }, 1000)
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [runTimer, onBreak, breakMin, workMin]);


  //useEffects used to check when the time in minutes change to update the seconds to that number in minutes
  useEffect(() => {
    setBreakSec(breakMin * 60)
  }, [breakMin])

  useEffect(() => {
    setWorkSec(workMin * 60)
  }, [workMin])

  return (
    <div className='container'>
      <header>Pomodoro Timer</header>
      <main>
        <section className='subContainer'>
          <div className='minSetter'>
            <h2 className='title'>Break Length</h2>
            <TimerSetter minutes={breakMin} minSetter={setBreakMin} />
          </div>
          <div className='minSetter'>
            <h2 className='title'>Session Length</h2>
            <TimerSetter minutes={workMin} minSetter={setWorkMin} />
          </div>
        </section>
        <section className='subContainer2'>
          <div className='timerContainer'>
            <h2 className='title'>{onBreak ? "Break" : "Session"}</h2>
            {/* conditional styling for when time is under 1 minute to make text red*/}
            <p style={breakSec < 60 || workSec < 60 ? {color: 'red'} : {}} className='timer'>{onBreak ? formatTime(breakSec) : formatTime(workSec)}</p>
          </div>
          <div className='playReset'>
              <HiMiniPlayPause onClick={() => handleTimer()}/>
              <VscDebugRestart onClick={() => handleRestart()}/>
          </div>
        </section>
        <audio ref={audioRef} src={sound}></audio>
      </main>
      <footer>
        <p>Designed and coded by</p>
        <p>Iggy Martin</p>
      </footer>
    </div>
  )
}

export default App
