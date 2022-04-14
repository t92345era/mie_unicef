import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Divider, Fab, FormControlLabel, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { APP_PAGE_TILE } from '../redux/modules/app';
import { RootState } from '../redux/modules/root';
import { FETCH_USERS, User } from '../redux/modules/user';
import UserAccodion from './UserAccodion';
import AddIcon from '@mui/icons-material/Add';

// 共通テキストボックススタイル
const CustomTextField = styled(TextField)({
  width: "100%"
});

/**
 * 受信
 */
function UserList() {

  const users = useSelector((state: RootState) => state.user.users);
  //const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const [addUser, setAddUser] = useState<User | null>(null);

  // 初期表示
  useEffect(() => {
    dispatch(({ type: APP_PAGE_TILE, payload: "ユーザーメンテ" }));
    dispatch(({ type: FETCH_USERS }));
  }, []);

  /**
   * リストのアイコンマーク文字取得
   */
  function stringAvatar(name: string) {
    return {
      children: `${name[0]}`,
    };
  }

  /**
   * ユーザー追加の＋ボタンクリック
   */
  function handleAddUser() {
    setAddUser({
      id: "", MailAddress: "", MailDeli: false, UserId: "", UserName: "", UserSeq: -1
    });
    setTimeout(() => {
      document.body.scrollIntoView({behavior :"smooth", block: "end"});  
    }, 10);
    
  }

  /**
   * リストのクリック
   */
  function onClickList(item: User) {
    // setSelectedMessage(item);
    // setOpen(true);
  }

  /**
   * リストアイテムの作成
   */
  function createList(item: User): JSX.Element {
    return (
      <ListItem alignItems="flex-start" onClick={() => onClickList(item)}>
        <ListItemButton>
          <ListItemAvatar>
            <Avatar {...stringAvatar(item.UserName)} />
          </ListItemAvatar>
          <ListItemText
            primary={item.UserName}
            secondary={
              <Box>
                <Stack>
                  <Stack direction="row" alignItems="center">
                    <EmailIcon />
                    <span>{item.MailDeli ? "配信あり" : "対象外"}</span>
                  </Stack>
                  <Fragment>{item.MailAddress}</Fragment>
                </Stack>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <span>A</span>
          </ListItemSecondaryAction>
        </ListItemButton>
      </ListItem>
    );
  }

  function careteAccordion(item: User): JSX.Element {

    return (
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content">
          <Grid container spacing={2}>
            <Grid item xs="auto">
              <Avatar {...stringAvatar(item.UserName)} />
            </Grid>
            <Grid item xs>
              <Box>
                <Stack>
                  <Typography sx={{ mb: 1 }} variant="subtitle1">{item.UserName}</Typography>
                  <Stack direction="row" alignItems="center">
                    <EmailIcon color="action" />
                    <span>{item.MailDeli ? "配信あり" : "対象外"}</span>
                  </Stack>
                  <Fragment>{item.MailAddress}</Fragment>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Stack spacing={1}>
              <CustomTextField
                variant="filled"
                label="氏名"
                value={item.UserName}
              />
              <CustomTextField
                variant="filled"
                label="メールアドレス"
                value={item.MailAddress}
              />
              <FormControlLabel
                control={
                  <Switch name="gilad" />
                }
                label="Gilad Gray"
              />
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <div>
      <Stack sx={{ my: 1 }}>
        {users.map((item, index) => (
          <React.Fragment key={index}>
            <UserAccodion user={item} />
          </React.Fragment>
        ))}
        {addUser != null && (
            <UserAccodion user={addUser} newData={true} />
        )}
      </Stack>
      <Box sx={{height: "70px"}}></Box>
      {/* <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {users.map((item, index) => (
          <React.Fragment key={index}>
            {createList(item)}
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List> */}
      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        aria-label="add"
        onClick={handleAddUser}>
        <AddIcon />
      </Fab>
    </div>
  );
}

export default UserList;
