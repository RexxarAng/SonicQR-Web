import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});

export default function SimpleBottomNavigation() {
  const history = useHistory();
  const [value, setValue] = React.useState(0);

  const classes = useStyles();

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        history.push(newValue);
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Home" value='/' icon={<HomeIcon />} />
      <BottomNavigationAction label="Send" value='/send' icon={<PublishIcon />} />
      <BottomNavigationAction label="Receive" value='/receive' icon={<GetAppIcon />} />
    </BottomNavigation>
  );
}