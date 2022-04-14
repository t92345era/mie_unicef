import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SendIcon from '@mui/icons-material/Send';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { Avatar, Button, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import PersonIcon from '@mui/icons-material/Person';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import LoginDialog from './dialog/Login';
import Error404 from './Error404';
import ReceiveList from './receive/ReceiveList';
import { RootState } from './redux/modules/root';
import Send from './send/Send';
import SendList from './send/SendList';
import Cookies from 'js-cookie';
import { APP_AUTH_HASH, APP_LOGIN } from './redux/modules/app';
import UserList from './users/UserList';

const drawerWidth = 240;

function App(props: any) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const pageTitle = useSelector((state: RootState) => state.app.pageTitle);
  const isLogin = useSelector((state: RootState) => state.app.login);
  const dispatch = useDispatch();

  // 初期表示
  React.useEffect(() => {
    if (!isLogin) {
      const k = Cookies.get('authkey');
      if (k) {
        dispatch(({ type: APP_LOGIN, payload: true }));
        dispatch(({ type: APP_AUTH_HASH, payload: k }));
      }
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onClickLogin = () => {
    setLoginOpen(true);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          メール配信とか
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem >
          <Button
            variant="contained"
            size="large"
            endIcon={<SendIcon />}
            component={Link}
            to="/send">
            メール送信
          </Button>
        </ListItem>
        <ListItem button component={Link} to="/receive">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="受信メール" />
        </ListItem>
        <ListItem button component={Link} to="/sendhis">
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="送信済メール" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/users">
          <ListItemIcon>
            <SupervisedUserCircleIcon />
          </ListItemIcon>
          <ListItemText primary="ユーザー管理" />
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {pageTitle}
            </Typography>
            {!isLogin ?
              (<Box>
                <Button color="inherit" onClick={onClickLogin}>Login</Button>
              </Box>)
              :
              (<Box>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                  <Typography>ログイン済み</Typography>
                </Stack>
              </Box>)
            }
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}>
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open>
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          <Toolbar />
          {isLogin ?
            (
              <Routes>
                <Route path="/" element={
                  <Box sx={{ p: 2 }}>ユニセフ三重用のメール送信機能です。左側のメニューから操作してください。</Box>
                } />
                <Route path="/send" element={<Send />} />
                <Route path="/receive" element={<ReceiveList />} />
                <Route path="/sendhis" element={<SendList />} />
                <Route path="/users" element={<UserList />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            )
            : (
              <Box sx={{ p: 2 }}>まず、ログイン</Box>
            )
          }

        </Box>
      </Box>
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)} />
    </BrowserRouter>
  );
}

App.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default App;
