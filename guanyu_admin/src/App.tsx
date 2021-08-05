import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom'
import route from './route/config'
import Login from './pages/login/login';
import './App.css';




function App() {
  return (
    <BrowserRouter>
      <Switch>
        {
          route.map((value:any, index) => {
            return (
              <Route path={value.path} component={value.page} key={index}/>
            )
          })
        }
        <Redirect to="/login" component={Login}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
