import React, { useEffect, useState } from 'react';

import { createBrowserHistory } from 'history';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import {
  AppBar,
  Card,
  CardActionArea,
  Divider,
  Toolbar,
  makeStyles,
} from '@material-ui/core';


import axios from 'axios';


import { BrowserRouter } from 'react-router-dom';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InventoryHome from './Componentes/Inventory/InventoryHome';


const useStyles = makeStyles((theme) => ({
  appbar: {
    minHeight: 60,
    width: '100%',
    backgroundColor: '#34ACAA',
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  position: {
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: `url(/logo.png)`,
  },
  name: {
    marginLeft: '2%',
    marginTop: 12,
    textDecoration: 'none',
  },
  bg_image: {
    backgroundImage: `url(/logo.png)`,
    backgroundrepeat: 'no-repeat',
  },
  error: {
    color: 'red',
  },
  footer: {
    minHeight: 60,
    width: '100%',
    backgroundColor: '#34ACAA',
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
}));
function LoginPage({ setIsAuthenticated }) {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/user/login', {
        username,
        password,
      });
      const { token, role } = response.data;
      sessionStorage.setItem('isAuthenticated', role);
      setIsAuthenticated(role);

      // Set token in axios defaults for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on role
      if (role === 'admin') {
        history.push('/admin');
      } else if (role === 'fleet') {
        history.push('/fleet');
      } else if (role === 'inventory') {
        history.push('/inventory');
      } else if (role === 'hr') {
        history.push('/hr');
      } else if (role === 'fleetadmin') {
        history.push('/fleetadmin');
      } else if (role === 'it_admin') {
        history.push('/it_admin');
      }

      // Add more cases for other roles here

      sessionStorage.setItem('authenticated', 'true');
    } catch (error) {
      setError('Invalid username or password');
      resetErrorAfterDelay(3000);
    }
  };

  const resetErrorAfterDelay = (delay) => {
    setTimeout(() => {
      setError('');
    }, delay);
  };

  return (
    <div>
      <Card>
        <CardActionArea>
          <form className="login">
            <label>UserName</label>
            <input
              className="input-parent"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <label>Password</label>
            <input
              className="input-parent"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="button" onClick={handleLogin}>
              Login
            </button>
            {error && <p>{error}</p>}
          </form>
        </CardActionArea>
      </Card>
    </div>
  );
}
function About() {
  return (
    <div>
      <Row>
        <Col>Misson </Col>
        <Col> Vission </Col>
        <Col> Value</Col>
      </Row>
    </div>
  );
}
function Contact() {
  return (
    <div>
      <Row>
        <Col>Linkdin </Col>
        <Col> Tewiter </Col>
        <Col> Instagram</Col>
      </Row>
    </div>
  );
}
function AdminPage() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(''); // Initialize with an empty string or a default role
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState('');
  const roles = ['admin', 'fleet', 'itllist', 'hr', 'fleetadmin', 'it_admin']; // Available roles
  const classes = useStyles();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword || !role) {
      setErrorMessage(
        <h4 className={classes.error}>Please fill in all fields correctly.</h4>
      );
      resetErrorMessageAfterDelay(3000); // Display error for 3 seconds
    } else if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      resetErrorMessageAfterDelay(3000); // Display error for 3 seconds
    } else {
      axios
        .post('http://localhost:3001/user/register', { username, password, role })
        .then((response) => {
          console.log(response.data);
          // Reset form fields
          setUsername('');
          setPassword('');
          setRole('');
          setErrorMessage('');
          setConfirmPassword('');
          setSuccessMessage('Registration successful!');
          resetErrorMessageAfterDelay(3000);
        })
        .catch((error) => {
          console.error('Error registering:', error.response.data.error);
          setErrorMessage('An error occurred while registering.');
        });
    }
  };
  useEffect(() => {
    axios
      .get('http://localhost:3001/user/userManager')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const resetErrorMessageAfterDelay = (delay) => {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, delay);
  };
  function update() {
    return <div>welcome to update page</div>;
  }
  return (
    <Row md={12} lg={12} sm={12}>
      <Col md={6} lg={6} sm={12}>
        <Card>
          <CardActionArea>
            <form onSubmit={handleSubmit} className="register">
              {errorMessage && <p>{errorMessage}</p>}
              {successMessage && <p>{successMessage}</p>}

              <h4>User Registration page</h4>
              <label>
                User name:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <br />
              <label>
                Confirm Password:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
              <label>
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select a role</option>
                  {roles.map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {roleOption}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <button type="submit">Create</button>
            </form>
          </CardActionArea>
        </Card>
      </Col>
      <Col>
        <Row>
          <Col>
            {' '}
            <CardActionArea>View</CardActionArea>
            {user.length === 0 ? (
              <h5> No User</h5>
            ) : (
              user.map((item, index) => (
                <Card key={index}>
                  <Card> UserName:{item.username}</Card>
                  <Card>Role:{item.role}</Card>
                </Card>
              ))
            )}
          </Col>
          <Col>
            {' '}
            <Link to="/admin/update" component={update}>
              update
            </Link>
          </Col>
          <Col>
            {' '}
            <CardActionArea>Delete</CardActionArea>
          </Col>
          <Card></Card>
        </Row>
      </Col>
    </Row>
  );
}

function Homepage() {
  const classes = useStyles();
  return <div className={classes.bg_image}></div>;
}
function FleetPage() {
  return (
    <div>
      Hello
    </div>
  );
}
function ITPage() {
  return (
    <div>
      hello
    </div>
  );
}
function FleetResponse() {
  return (
    <div>
 hello
    </div>
  );
}
function ItListPage() {
  return (
    <div>
     hello
    </div>
  );
}
function HRPage() {
  return (
    <div>
    hi
    </div>
  );
}
function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    setIsAuthenticated(storedAuth || '');
  }, []);

  const handleLogin = (authType) => {
    setIsAuthenticated(authType);
    sessionStorage.setItem('isAuthenticated', authType);
  };

  const handleLogout = () => {
    setIsAuthenticated(null);
    localStorage.removeItem('isAuthenticated');
    history.push('/login');
  };

  return {
    isAuthenticated,
    handleLogin,
    handleLogout,
  };
}

function ProtectedRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function App() {
  const history = createBrowserHistory();
  const { isAuthenticated, handleLogin, handleLogout } = useAuthentication();

  const classes = useStyles();

  if (isAuthenticated === null) {
    return <div>Loadning............</div>;
  }

  return (
    <div>
      <BrowserRouter history={history}>
        <div className={classes.position}>
          <AppBar position="fixed" className={classes.appbar}>
            <Link to="/" className={classes.name}>
              {' '}
              EEIG
            </Link>
            <Link to="/about" variant="h6" noWrap className={classes.name}>
              About Us
            </Link>
            <Link to="/contact" variant="h6" noWrap className={classes.name}>
              Contact Us
            </Link>

            <Link to="/login" className={classes.name}>
              Login
            </Link>
          </AppBar>
          <Toolbar />
          <Homepage></Homepage>
          <Switch>
          <Route path="/admin" component={AdminPage} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/login">
              <LoginPage setIsAuthenticated={handleLogin} />
            </Route>
            <ProtectedRoute
              path="/itemdetail/:serial_number"
              component={ItListPage}
              isAuthenticated={isAuthenticated === 'itllist'}
            />
            <ProtectedRoute
              path="/updateitem/:serial_number"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'itllist'}
            />
            <ProtectedRoute
              path="/inventory/:category"
              component={InventoryHome}
              isAuthenticated={isAuthenticated === 'inventory'}
            />
            <ProtectedRoute
              path="/it_admin"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'it_admin'}
            />
            <ProtectedRoute
              path="/admin"
              component={AdminPage}
              isAuthenticated={isAuthenticated === 'admin'}
            />
            <ProtectedRoute
              path="/admin/update"
              component={AdminPage}
              isAuthenticated={isAuthenticated === 'admin'}
            />
            <ProtectedRoute
              path="/hr"
              component={HRPage}
              isAuthenticated={isAuthenticated === 'hr'}
            />
            <ProtectedRoute
              path="/hr"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'hr'}
            />
            <ProtectedRoute
              path="/newRegistration"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'hr'}
            />
            <ProtectedRoute
              path="/employeeUpdate/:id"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'hr'}
            />

            <ProtectedRoute
              path="/inventory/add"
              component={InventoryHome}
              isAuthenticated={isAuthenticated === 'inventory'}
            />
            <ProtectedRoute
              path="/Inventory"
              component={InventoryHome}
              isAuthenticated={isAuthenticated === 'inventory'}
            />
            <ProtectedRoute
              path="/fleetadmin"
              component={FleetResponse}
              isAuthenticated={isAuthenticated === 'fleetadmin'}
            />
            <ProtectedRoute
              path="/fleet/fleetresponse/:user_id"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'fleetadmin'}
            />
            <ProtectedRoute
              path="/fleet"
              component={FleetPage}
              isAuthenticated={isAuthenticated === 'fleet'}
            />
            <ProtectedRoute
              path="/newrequest"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'fleet'}
            />
            <ProtectedRoute
              path="/fleetStatus"
              component={ITPage}
              isAuthenticated={isAuthenticated === 'fleet'}
            />
            <Redirect to="/" component={Homepage} />
          </Switch>
        </div>
      </BrowserRouter>
      <div>
        <body className={classes.bg_image}></body>
        <footer
          style={{
            color: '',
            position: 'sticky',
            backgroundColor: 'gray',

            width: '100%',
            marginTop: '40%',
          }}
        >
          <div>
            <Row>
              <Col md={6} lg={4} sm={12}>
                Visit Us
                <Divider />
              </Col>
              <Col md={6} lg={4} sm={12}>
                Contact Us
                <Divider />
                Facebook{' '}
                <a href="https://www.facebook/eeigconstruction.com">
                  www.facebook/eeigconstruction.com
                </a>
                <br />
                Linkdin:
                <a href="https://www.linkdin.com">
                  www.Linkdin/eeigconstruction.com
                </a>
                <br />
                Tewiter:
                <a href="https://twitter.com/EEIGC">
                  https://twitter.com/EEIGC7
                </a>
                <br />
                Instagram:
                <a href="https://www.instagram/eeigconstruction.com">
                  www.instagram/eeigconstruction.com
                </a>
                <br />
                Telegram:
                <a href="https://www.telegram/eeigconstruction.com">
                  www.telegram/eeigconstruction.org
                </a>
                <br />
              </Col>
              <Col md={6} lg={4} sm={12}>
                Developer
                <Divider />
              </Col>
            </Row>
          </div>
          <center>Copyright ...</center>
        </footer>
      </div>
    </div>
  );
}

export default App;



