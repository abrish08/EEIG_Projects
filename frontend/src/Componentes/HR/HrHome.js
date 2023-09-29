import { AppBar, Button, Drawer, IconButton, List, ListItem, ListItemText,Snackbar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Route, BrowserRouter as Router, Switch,useHistory} from 'react-router-dom';

import { useParams } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { } from 'react-router-dom';
const drawerWidth = 170;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    minHeight: 60,
    backgroundColor: '#34ACAA',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    overflow: 'auto',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: 0,
    // Remove the default padding
  },
  listItem: {
    paddingTop: 0, // Remove the default padding
    paddingBottom: 0, // Remove the default padding
  },
  printer: {
    padding: theme.spacing(0),
  },
  addbtn: {
    marginLeft: '75%',
    backgroundColor: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '25%',
  },
  instruction: {
    backgroundColor: 'red',
  },
  listItemSticky: {
    position: 'sticky',
    top: 64, // Adjust the value to match the height of the app bar
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function UpdateForm() {
  const classes=useStyles();
  const history = useHistory();
  const { serial_number } = useParams();
  const [loading, setLoading] = useState(true);
  const [laptop, setLaptop] = useState({});
  const [editedLaptop, setEditedLaptop] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get(
        'http://localhost:3001/laptopData/' + encodeURIComponent(serial_number)
      )
      .then((response) => {
        setLaptop(response.data);
        setEditedLaptop(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serial_number]);

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditedLaptop((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(
        'http://localhost:3001/updateItem/' + encodeURIComponent(serial_number),
        editedLaptop
      )
      .then((response) => {
        console.log('Update response:', response.data);
        setSuccessMessage('Update was successful!');
        setOpenSuccessSnackbar(true);
        // Optionally, you can clear the success message after a few seconds
        setTimeout(() => {
          setSuccessMessage('');
          setOpenSuccessSnackbar(false);
        }, 5000);
        // Redirect to the detail page after updating
        history.push(`/detail/${serial_number}`);
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      <form className={classes.form}>
        <label>
          department
          <select
            value={editedLaptop.department}
            onChange={(e) => handleInputChange(e, 'department')}
            name="department"
          >
            <option value="">
              Select one of The department you want to add{' '}
            </option>
            <option value="Printer">Printer</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Mobile&Phone">Mobile&Phone</option>
            <option value="Dongle&Internet">Dongle&Internet</option>
            <option value="Network Device">Network Device</option>
            <option value="Network Device">Network Device</option>
            <option value="Network Device">Network Device</option>
            <option value="Network Device">Network Device</option>
            <option value="Office Equipement">Office Equipement</option>
            <option value="Network Device">Other</option>
            <option value="Network Device">Network Device</option>
            <option value="CCTV Camera & Tv">CCTV Camera & Tv</option>
            <option value="UPS">UPS</option>
          </select>
        </label>
        <input
          type="text"
          defaultValue={editedLaptop.user}
          onChange={(e) => handleInputChange(e, 'user')}
        />
        <input
          type="text"
          defaultValue={editedLaptop.model}
          onChange={(e) => handleInputChange(e, 'model')}
        />
        <input
          type="text"
          defaultValue={editedLaptop.serial_number}
          onChange={(e) => handleInputChange(e, 'serial_number')}
        />
        <input
          type="text"
          defaultValue={editedLaptop.user_dept}
          onChange={(e) => handleInputChange(e, 'user_dept')}
        />
        <input
          type="date"
          defaultValue={editedLaptop.issue_date}
          onChange={(e) => handleInputChange(e, 'issue_date')}
        />
        <input
          type="text"
          defaultValue={editedLaptop.remark}
          onChange={(e) => handleInputChange(e, 'remark')}
        />
        <input
          type="text"
          defaultValue={editedLaptop.location}
          onChange={(e) => handleInputChange(e, 'location')}
        />
        <Button onClick={(e) => handleUpdate(e)}>Update</Button>
      </form>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSuccessSnackbar}
        message={successMessage}
      />
    </div>
  );
}

function AddNew() {
  const classes = useStyles();
  const [values, setValues] = useState({
    department:'',
    firstname:'',
    lastname:'',
    employee_id:'',
    job_position:'',
  
    hire_date:'',
    level:'',
    location:'',
    remark:'',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [customdepartment, setCustomdepartment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [data, setData] = useState('');
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selecteddepartment =
      values.department === 'Other' ? customdepartment : values.department;

    if (selecteddepartment.trim() === '') {
      setErrorMessage('Please select a department or enter a custom department');
      return;
    }

    // Send the form data to the Node.js server
    axios
      .post('http://localhost:3001/hr/insertData', {
        department: selecteddepartment, // Use selecteddepartment here
        firstname: values.firstname,
        lastname: values.lastname,
        employee_id: values.employee_id,
        job_position: values.job_position,
        hire_date: values.hire_date,
        level: values.level,
        location: values.location,
        remark: values.remark,
      })
      .then((response) => {
        setSuccessMessage(response.data.message);
        setOpenSuccessSnackbar(true);
        setTimeout(() => {
          setSuccessMessage('');
          setOpenSuccessSnackbar(false);
        }, 5000);
        setErrorMessage('');
        setValues({
          department:'',
          firstname:'',
          lastname:'',
          employee_id:'',
          job_position:'',
        
          hire_date:'',
          level:'',
          location:'',
          remark:'',
        });
        setCustomdepartment(''); // Reset custom department input
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrorMessage(
            'Product already exists. Please enter a different value.'
          );
        } else {
          setErrorMessage('Sorry Serial Number alerady exist please cheak it.');
        }
        setSuccessMessage('');
      });

    axios
      .get('http://localhost:3001/employeeData')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };
  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };
  return (
    <div>
      <h2>
        Please provide all necessary information based on the given Instruction
      </h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className={classes.form}>
        <Row>
          <Col>
            <div>
              <label>department
              <select
                value={values.department}
                onChange={handleChange}
                name="department"
                className={classes.input}
              >
                <option value="">Select department To Add </option>
                <option value="Printer">Printer</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Mobile&Phone">Mobile&Phone</option>
                <option value="Dongle&Internet">Dongle&Internet</option>
                <option value="Network Device">Network Device</option>
                <option value="CCTV Camera & Tv">CCTV Camera & Tv</option>
                <option value="UPS">UPS</option>
                <option value="Other">Other</option>
              </select>
              </label>
            </div>
            {values.department === 'Other' && (
              <div>
                <label>Custom department:</label>
                <input
                  type="text"
                  value={customdepartment}
                  onChange={(e) => setCustomdepartment(e.target.value)}
                  name="customdepartment"
                  placeholder="Enter custom department"
                  className={classes.input}
                />
              </div>
            )}

            <label>Responsible Employee:</label>
            <input
              type="text"
              value={values.user}
              onChange={handleChange}
              name="user"
              placeholder="who is the user for this property "
              className={classes.input}
            />

            <div>
              <label>Model:</label>
              <input
                className={classes.input}
                type="text"
                value={values.model}
                onChange={handleChange}
                name="model"
                placeholder="Model"
              />
            </div>
            <div>
              <label>Serial Number:</label>
              <input
                className={classes.input}
                type="text"
                value={values.serial_number}
                onChange={handleChange}
                name="serial_number"
                placeholder="insert serial number correctly"
              />
            </div>
            <div>
              <label>Quantity:</label>
              <input
                className={classes.input}
                type="Number"
                value={values.quantity}
                onChange={handleChange}
                name="quantity"
                placeholder="Quantity"
              />
            </div>
            <div>
              <label>User Department:
              <input
                className={classes.input}
                type="text"
                value={values.user_dept}
                onChange={handleChange}
                name="user_dept"
                placeholder="User Department "
              />
              </label>
            </div>
          </Col>
          <Col>
            <div>
              <label>User Position:</label>
              <input
                className={classes.input}
                type="text"
                value={values.user_position}
                onChange={handleChange}
                name="user_position"
                placeholder="user_position"
              />
            </div>
            <div>
              <label>Issue Date:</label>
              <input
                className={classes.input}
                type="Date"
                value={values.issue_date}
                onChange={handleChange}
                name="issue_date"
                placeholder="issue_date"
              />
            </div>
            <div>
              <label>Remark:</label>
              <input
                className={classes.input}
                type="text"
                value={values.remark}
                onChange={handleChange}
                name="remark"
                placeholder="remark"
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                className={classes.input}
                type="text"
                value={values.location}
                onChange={handleChange}
                name="location"
                placeholder="Location"
              />
            </div>
            <div>
              <label>Status:</label>
              <input
                className={classes.input}
                type="text"
                value={values.status}
                onChange={handleChange}
                name="status"
                placeholder="status"
              />
            </div>
          </Col>
          <div>
            {' '}
            <button type="submit" className={classes.addbtn}>
              ADD
            </button>
          </div>
        </Row>
      </form>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSuccessSnackbar}
        message={successMessage}
      />
    </div>
  );
}
function DepartmentList(){
  const { department } = useParams();
  const [loading, setLoading] = useState(true);
  const [laptop, setLaptop] = useState(null);
  useEffect(() => {
    setLoading(true);

    axios
      .get('http://localhost:3001/inventory/departmentData/' + encodeURIComponent(department))
      .then((response) => {
        setLaptop(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [department]);
  return(
    <div>
hllo
      
    </div>
  );

}
function HrHome() {
    const classes = useStyles();
    const [searchQuery, setSearchQuery] = useState('');
    
    const { department } = useParams();
    const [loading, setLoading] = useState(true);
    const [laptop, setLaptop] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
      setDrawerOpen(!drawerOpen);
    };
    useEffect(() => {
      setLoading(true);
  
      axios
        .get('http://localhost:3001/inventory/categories/')
        .then((response) => {
          setLaptop(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [department]);
    const filteredLaptop = laptop.filter((item) =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    return (
      <Router>
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
              >
                 <MenuIcon /> 
              </IconButton>
              <Typography variant="h6" noWrap>
                EEIG
              </Typography>
              <Button
                component={Link}
                to="/inventory/add"
                className={classes.addbtn}
              >
                ADD NEW
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={drawerOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Toolbar />
            <List className={classes.listItemSticky}>
              <ListItemText primary=" Departmente" />
            </List>
            <input
              type="text"
              placeholder="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <List>
              {filteredLaptop.map((department) => (
                <ListItem key={department}>
                  <Link to={`/inventtory/${department}`}>{department}</Link>
                </ListItem>
              ))}
              <ListItem
                button
                component={Link}
                to="/itlist/instruction"
                className={classes.instruction}
              ></ListItem>
            </List>
          </Drawer>
          <main className={classes.content}>
            <Switch>
               <Route exact path="/inventry/:department" component={DepartmentList} /> 
            
              {/* <Route path="/itemdetail/:serial_number" component={DetailPage} />*/}
              <Route path="/updateitem/:serial_number" component={UpdateForm} /> 
              <Route path="/inventory/add" component={AddNew} />
            
              
              {/* Add more routes for additional screens */}
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
export default HrHome;