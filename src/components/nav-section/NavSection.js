import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, Button, Collapse, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (path) => {
    // console.log(path, isOpen);
    if (isOpen === path) {
      setIsOpen(false);
    } else {
      setIsOpen(path);
    }
  };
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem isOpen={isOpen === item.path && isOpen} toggleOpen={toggleOpen} key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  isOpen: PropTypes.bool,
  toggleOpen: PropTypes.func,
};

function NavItem({ item, isOpen, toggleOpen }) {
  const { title, path, icon, info, hasChild, child } = item;

  return hasChild ? (
    <>
      <StyledNavItem
        component={Button}
        fullWidth
        onClick={() => toggleOpen(path)}
        // to={path}
        sx={{
          '&.active': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightBold',
          },
        }}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

        <ListItemText disableTypography primary={title} />

        {info && info}
      </StyledNavItem>
      <Collapse in={isOpen} sx={{ marginLeft: 2 }}>
        {child.map((childItem) => (
          <StyledNavItem
            key={childItem.title}
            component={RouterLink}
            to={childItem.path}
            sx={{
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          >
            <StyledNavItemIcon>{childItem.icon && childItem.icon}</StyledNavItemIcon>

            <ListItemText disableTypography primary={childItem.title} />

            {childItem.info && childItem.info}
          </StyledNavItem>
        ))}
      </Collapse>
    </>
  ) : (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
