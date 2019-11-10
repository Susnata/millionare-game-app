import React from 'react';
import logo from './logo.svg';
import './App.css';


class Timer extends React.Component{
  constructor(props){
    super(props);
    this.state={
      currentCount : 30
    }
    this.handlePauseButtonClick=this.handlePauseButtonClick.bind(this);
  }

  tick(){
    if (this.state.currentCount > 0 && this.props.start===true &&this.props.pause===false){
      this.setState(state => ({
        currentCount: state.currentCount - 1
      }));
    }
  }

  componentDidMount(){
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  handlePauseButtonClick(e){
    this.props.handlePause();
  }

  render(){
    if (this.state.currentCount <= 0 || this.props.stop){
      clearInterval(this.intervalId);
    }
    return (
      <div id="clock">
        <div id="timer">
          {this.state.currentCount}
          <br/>
          seconds
        </div>
        <div id="pauseButton" onClick={this.handlePauseButtonClick}>
          ||
        </div>
      </div>
            
    )
  }
}

class DisplayQuestion extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedOption: -1
    };
    this.handleClick=this.handleClick.bind(this);
  }

   handleClick(index, e){
    this.setState({selectedOption: index});
    this.props.handleStopTime(true);
    
   }

   getClassNameForOption(index){
    let currentQNo = this.props.currentQNo;
    const selectedOption = this.state.selectedOption;
    const correctOption = QUESTIONBANK[currentQNo].correct;
    let classNameList = 'disabledOption';
    if (selectedOption >= 0){
      if (index === selectedOption){
        return `${classNameList} ${selectedOption === correctOption ? 'matchedAnswer' : 'selectedAnswer'}`;
      } else if (index === correctOption){
        return `${classNameList} correctAnswer`;
       }
      return classNameList;
    }
    return '';
  }

  render(){
    let currentQNo = this.props.currentQNo;
    const question = QUESTIONBANK[currentQNo].question;
    const selectedOption = this.state.selectedOption;
    const options = QUESTIONBANK[currentQNo].options.map((option, index) => {
      let t1 = this.handleClick.bind(this, index); // typeof t1 === 'function'
      return (<li key={index} 
                  className={this.getClassNameForOption(index)} 
                  onClick={t1}>
                  {option}
              </li>) ;
    });

    return (
      <div className="questionSection">
        <p>{question}</p>
        <ol type="A" className={selectedOption >= 0 ? 'disabledList' : ''}>{options}</ol>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionNo: 0,
      startTimer: true,
      stopTimer: false,
      pauseTimer: false,
      timerStatus: 'start',
    }
    this.handleStopTimer=this.handleStopTimer.bind(this);
    this.handlePauseTimer=this.handlePauseTimer.bind(this);
  }

  handleStopTimer(timerFlag){
    this.setState({stopTimer : timerFlag, timerStatus: 'stop'});
  }

  handlePauseTimer(){
    //debugger;
    this.setState({pauseTimer : !this.state.pauseTimer, timerStatus: 'pause'});
  }
  render(){
    return (
      <div className="container">
        <DisplayQuestion currentQNo={this.state.currentQuestionNo} stop={this.state.stopTimer} handleStopTime={this.handleStopTimer}/>
        <Timer status={this.state.timerStatus}
              // start={this.state.startTimer} 
              // stop={this.state.stopTimer} 
              // pause={this.state.pauseTimer}
              handlePause={this.handlePauseTimer}/>
      </div>
    );
  }
}

const QUESTIONBANK = [
  {serialNo: 1, question:'What is the planet nearest to Sun?', options:['Mars','Earth', 'Venus', 'Mercury'], correct: 3},
  {serialNo: 2, question:'What is the planet nearest to Earth?', options: ['Mars','Jupiter','Venus','Mercury'], correct: 2}
]

export default App;
