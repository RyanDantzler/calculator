/* global React, ReactDOM */
/* eslint-disable react/prop-types, react/no-multi-comp */

// eslint-disable-next-line no-unused-vars
const projectName = 'calculator';

// coded by @RyanDantzler (github) / @ryandantzler (codepen)

const numberNames = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const activeState = {
  backgroundColor: "#cf9834",
  boxShadow: "0 0 5px rgba(255, 165, 0, 0.5)" 
}

const inactiveState = {
  backgroundColor: "#999"
}

const hoverState = {
  backgroundColor: "#888"
}

const activeEquals = {
  backgroundColor: "#3b8cc5",
  boxShadow: "0 0 5px rgba(54, 159, 233, 0.5)" 
}

const inactiveEquals = {
  backgroundColor: "#77a6c7"
}

const hoverEquals = {
  backgroundColor: "#6691af"
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonStyle: this.props.buttonStyle
    };
    this.activateButton = this.activateButton.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.keydown = this.keydown.bind(this);
  }
  
  componentDidMount() {
    document.addEventListener('keydown', this.keydown);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown);
  }
  
  activateButton(e) {
    this.props.clickHandler(this.props.symbol);
    
    if (this.props.name === "equals") {
      this.setState({
        buttonStyle: activeEquals
      });
      setTimeout(() => {
        this.setState({
          buttonStyle: inactiveEquals
        });
      }, 100);
    } else {
      this.setState({
        buttonStyle: activeState
      });
      setTimeout(() => {
        this.setState({
          buttonStyle: inactiveState
        });
      }, 100);
    }
  }
  
  mouseOver() {
    if (this.props.name === "equals") {
      this.setState({
        buttonStyle: hoverEquals
      });
    } else {
      this.setState({
        buttonStyle: hoverState
      });
    }
  }
  
  mouseOut() {
    if (this.props.name === "equals") {
      this.setState({
        buttonStyle: inactiveEquals
      });
    } else {
      this.setState({
        buttonStyle: inactiveState
      });
    }
  }
  
  keydown(e) {
    let key = e.keyCode;
    key = (96 <= key && key <= 105) ? key-48 : key;
    
    switch(key) {
      case 13: if (this.props.symbol == '=') {
          this.activateButton();
        }
        break;
      case 111: if (this.props.symbol == '/') {
          this.activateButton();
        }
        break;
      case 106: if (this.props.symbol == '*') {
          this.activateButton();
        }
        break;
      case 109: if (this.props.symbol == '-') {
          this.activateButton();
        }
        break;
      case 107: if (this.props.symbol == '+') {
          this.activateButton();
        }
        break;
      case 110: if (this.props.symbol == '.') {
          this.activateButton();
        }
        break;
      case 8:
      case 46: if (this.props.symbol == 'C') {
          this.activateButton();
        }
        break;
      default: if (key == this.props.symbol.toString().charCodeAt(0)) {
          this.activateButton();
        }
        break;
    }
  }
    
  render() {
    return (
      <div id={this.props.name} 
        className="button" 
        onClick={this.activateButton} 
        onMouseOver={this.mouseOver} 
        onMouseOut={this.mouseOut} 
        style={this.state.buttonStyle}>{this.props.symbol}</div>
    );
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '0'
    };
    this.clear = this.clear.bind(this);
    this.operatorClick = this.operatorClick.bind(this);
    this.decimalClick = this.decimalClick.bind(this);
    this.numberClick = this.numberClick.bind(this);
    this.equalsClick = this.equalsClick.bind(this);
    this.calculate = this.calculate.bind(this);
  }
  
  clear() {
    this.setState({
      display: '0'
    });
  }
  
  operatorClick(val) {
    let inputArr = this.state.display.split(' ');
    let lastInput = inputArr[inputArr.length - 1];
    
    if (isNaN(lastInput)) {
      if (lastInput === val)
        return;
      
      if (val === '-') {
        this.setState(prevState => ({
          display: prevState.display + ' ' + val
        }));
      } else {
        this.setState(prevState => ({
          display: prevState.display.slice(0, prevState.display.length - 1) + val
        }));
      }
    } else {
      if (lastInput[lastInput.length - 1] === '.') {
        this.setState(prevState => ({
          display: prevState.display.slice(0, prevState.display.length - 1) + ' ' + val
        }));
      } else {
        this.setState(prevState => ({
          display: prevState.display + ' ' + val
        }));
      }
    }
  }
  
  decimalClick(val) {
    let inputArr = this.state.display.split(' ');
    let lastInput = inputArr[inputArr.length - 1];
    
    if (isNaN(lastInput)) {   
      this.setState(prevState => ({
        display: prevState.display + ' 0' + val
      }));
    } else {
      if (lastInput.indexOf('.') > 0)
        return;
      
      this.setState(prevState => ({
        display: prevState.display + val
      }));
    }
  }
  
  numberClick(val) {
    let inputArr = this.state.display.split(' ');
    let lastInput = inputArr[inputArr.length - 1];
    
    if (isNaN(lastInput)) {
      if (lastInput === '-' && inputArr.length > 1 && isNaN(inputArr[inputArr.length - 2])) {
        this.setState(prevState => ({
          display: prevState.display + val
        }));
      } else {
        this.setState(prevState => ({
          display: prevState.display + ' ' + val
        })); 
      }
    } else if (lastInput === '0') {
      this.setState(prevState => ({
        display: prevState.display.slice(0, prevState.display.length - 1) + val
      }));
    } else {
      this.setState(prevState => ({
        display: prevState.display + val
      }));
    }
  }

  equalsClick() {
    let result = this.calculate();
    this.setState({
      display: result.toString()
    });
  }
  
  calculate() {
    let inputArr = this.state.display.split(' ');
    let total = parseFloat(inputArr[0]);
    let lastOperator;
    
    for (let i = 1; i < inputArr.length; i++) {
      if (isNaN(inputArr[i])) {
        lastOperator = inputArr[i];
      } else {
        let num = parseFloat(inputArr[i]);
        switch(lastOperator) {
          case '/': total = parseFloat((total / num).toFixed(12));
            break;
          case '*': total = parseFloat((total * num).toFixed(12));
            break;
          case '-': total = parseFloat((total - num).toFixed(12));
            break;
          case '+': total = parseFloat((total + num).toFixed(12));
            break;
          default:
            break;
        }
      }
    }
    
    return total;
  }
  
  render() {
    let numbers = numberNames.map((val, index, arr) => {
      return (
        <Button name={arr[arr.length - index - 1]} symbol={arr.length - index} clickHandler={this.numberClick} />
      );
    });
    
    return (
      <div id="wrapper">
        <div id="display">{this.state.display}</div>
        <div id="buttons">
          <Button name="divide" symbol="/" clickHandler={this.operatorClick} buttonStyle={inactiveState} />
          <Button name="multiply" symbol="*" clickHandler={this.operatorClick} buttonStyle={inactiveState} />
          <Button name="clear" symbol="C" clickHandler={this.clear} buttonStyle={inactiveState} />
          <Button name="subtract" symbol="-" clickHandler={this.operatorClick} buttonStyle={inactiveState} />
          <Button name="add" symbol="+" clickHandler={this.operatorClick} buttonStyle={inactiveState} />
          <Button name="decimal" symbol="." clickHandler={this.decimalClick} buttonStyle={inactiveState} />
          <div className="numbers">{numbers}</div>
          <Button name="zero" symbol="0" clickHandler={this.numberClick} buttonStyle={inactiveState} />
          <Button name="equals" symbol="=" clickHandler={this.equalsClick} buttonStyle={inactiveEquals} />
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));