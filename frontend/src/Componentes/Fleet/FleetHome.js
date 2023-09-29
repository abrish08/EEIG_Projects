import { makeStyles } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
const drawerWidth = 170;
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    option: {
      fontSize: '16px', /* Adjust font size as needed */
      padding: '5px',
      color:'red', 
      overflow:'visible',  /* Adjust padding as needed */
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
  
function AddNew() {
    const classes = useStyles();
    const [employeeId, setEmployeeId] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [formData, setFormData] = useState({
      current_address: '',
      issue_date: '',
      destination: '',
      phone: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formChanged, setFormChanged] = useState(false); // Track if form data has changed
  
    const handleEmployeeIdChange = (event) => {
      setEmployeeId(event.target.value);
      setEmployeeData(null); // Clear the fetched data when employeeId changes
      setErrorMessage(''); // Clear any previous error messages
    };
  
    const handleFetchEmployeeData = async () => {
      const url =
        'http://localhost:3001/hr/employees/' + encodeURIComponent(employeeId);
  
      try {
        const response = await axios.get(url);
        const data = response.data;
  
        console.log('Response from server:', data);
  
        if (response.status === 200) {
          setEmployeeData({
            firstname: data.firstname,
            lastname: data.lastname,
            department: data.department,
            user_id: data.id,
            user_position: data.user_position,
          });
          setErrorMessage('');
        } else {
          setErrorMessage(data.error || 'Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Unable to get Your Credentials please check your ID');
      }
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
  
      // You can add specific validation logic for each field here
      if (name === 'phone' && !/^\+?\d{10,}$/g.test(value)) {
        setErrorMessage('Invalid phone number format');
      } else {
        setErrorMessage('');
      }
  
      // Update the formData state with the new value
      setFormData({
        ...formData,
        [name]: value,
      });
  
      // Set formChanged to true when any field changes
      setFormChanged(true);
    };
  
    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Check if any of the required fields are null
        if (
          !employeeData ||
          !formData.current_address ||
          !formData.issue_date ||
          !formData.destination ||
          !formData.phone
        ) {
          setErrorMessage('All fields are required');
          return; // Exit the function if any required field is null
        }
      
        // Check phone number format
        if (!/^\+?\d{10,}$/g.test(formData.phone)) {
          setErrorMessage('Invalid phone number format');
          return; // Exit the function if phone number format is invalid
        }
      
        const dataToSubmit = { ...employeeData, ...formData };
      
        fetch('http://localhost:3001/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 409) {
              // Handle the duplicate entry case
              throw new Error('Duplicate entry');
            } else {
              throw new Error('An error occurred');
            }
          })
          .then((data) => {
            console.log('Your Request Submitted Successfully:', data);
            setFormData({
              current_address: '',
              issue_date: '',
              destination: '',
              phone: '',
            }); // Clear form fields
            setSuccessMessage('Your Request Submitted Successfully.'); // Set success message
      
            // Clear success message after 45 seconds
            setTimeout(() => {
              setSuccessMessage('');
            }, 5000);
          })
          .catch((error) => {
            console.error('Error submitting form data:', error);
            if (error.message === 'Duplicate entry') {
              setErrorMessage(
                'You have already requested. Please contact the Fleet Manager.'
              );
            } else {
              setErrorMessage('An error occurred while submitting the form.');
            }
          });
      };
      
  
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            value={employeeId}
            onChange={handleEmployeeIdChange}
          />
          <button type="button" onClick={handleFetchEmployeeData}>
            Get
          </button>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
  
        <div>
          <label>First Name:</label>
          {employeeData && (
            <input type="text" value={employeeData.firstname} readOnly />
          )}
        </div>
        <div>
          <label>Last Name:</label>
          {employeeData && (
            <input type="text" value={employeeData.lastname} readOnly />
          )}
        </div>
        <div>
          <label>User ID:</label>
          {employeeData && (
            <input type="text" value={employeeData.user_id} readOnly />
          )}
        </div>
        <div>
          <label>Job Position:</label>
          {employeeData && (
            <input type="text" value={employeeData.user_position} readOnly />
          )}
        </div>
        <div>
          <label>Department:</label>
          {employeeData && (
            <input type="text" value={employeeData.department} readOnly />
          )}
        </div>
  
        <div>
          <label>Current Address:</label>
          <input
            type="text"
            name="current_address"
            value={formData.current_address}
            onChange={handleInputChange}
          />
        </div>
  
        <div>
          <label>Destination Address:</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
          />
        </div>
  
        <div>
          <label>Request Date:</label>
          <input
            type="date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleInputChange}
          />
        </div>
  
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
  
        {formChanged && successMessage && <h3>{successMessage}</h3>}
        {errorMessage && <h3>{errorMessage}</h3>}
        <button type="submit">Submit</button>
      </form>
    );
  }   
  function FleetHome(){
    return(
        <div>


            
        </div>
    );
  }   
  export default FleetHome;