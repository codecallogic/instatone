import React, { Component } from 'react';
import HomePage from '../HomePage/HomePage'
import LoginPage from '../LoginPage/LoginPage'
import SignUpPage from '../SignUpPage/SignUpPage'
import SequencePage from '../SequencePage/SequencePage'
import InstrumentsPage from '../InstrumentsPage/InstrumentsPage'
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom'
import userService from '../../utils/userService'
import songService from '../../utils/songService'
import io from 'socket.io-client'

const socketClient = io.connect('http://localhost:3001')

class App extends Component {
  constructor() {
    super()
    this.state = {
       user: userService.getUser(),
       socket: null

    }
  }

  handleLogout = () => {
    userService.logout()
    this.setState({user: null})
  }
  
  handleSignupOrLogin = () => {
    this.setState({
      user: userService.getUser(),
    })
  }

  async componentDidMount(){
    const songs = await songService.getSongs()
    this.setState({
      socket: socketClient
    })
    console.log(songs)
    console.log(this.state.user)
  }
  
  render () {
    return (
      <div className="App">
      <Switch>
        <Route exact path={"/"} render={() => 
          <HomePage 
            user={this.state.user}
            handleLogout={this.handleLogout}
          />
         }/>
        <Route exact path={"/login"} render={({history}) => 
          <LoginPage
            history={history}
            handleSignupOrLogin={this.handleSignupOrLogin}
          />
        }
        />
        <Route exact path={"/tuneroom"} render={({history}) =>  
          <SequencePage
            user={this.state.user}
            handleLogout={this.handleLogout}
            history={history}
            socket={this.state.socket}
          />
        }
        />
        <Route exact path={"/instruments"} render={({history}) =>  
          <InstrumentsPage
            user={this.state.user}
            handleLogout={this.handleLogout}
            history={history}
          />
        }
        />
        <Route exact path={"/signup"} render={({history}) => 
          <SignUpPage 
            history={history}
            handleSignupOrLogin={this.handleSignupOrLogin}
          />
        }
        />
      </Switch>
      </div>
    )
  }
}

export default App;
