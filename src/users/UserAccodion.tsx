import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Divider, FormControlLabel, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { APP_PAGE_TILE } from '../redux/modules/app';
import { RootState } from '../redux/modules/root';
import { FETCH_USERS, User } from '../redux/modules/user';
import PropTypes from 'prop-types';

// 共通テキストボックススタイル
const CustomTextField = styled(TextField)({
  width: "100%"
});

/**
 * 受信
 */
function UserAccodion(props: any) {

  const isNew = props.newData ?? false;
  const [open, setOpen] = useState(isNew);
  const item = props.user as User;
  const [userName, setUserName] = useState(item.UserName);
  const [mailAddress, setMailAddress] = useState(item.MailAddress);
  const [mailDeli, setMailDeli] = useState(item.MailDeli);

  /**
   * リストのアイコンマーク文字取得
   */
  function stringAvatar(name: string) {
    return {
      children: isNew ? "-" : `${name[0]}`,
    };
  }

  /**
   * 登録・更新ボタン押下
   */
  function onClickRegister() {
    
  }

  return (
    <Accordion
      expanded={open}
      onChange={(a, b) => { setOpen(b) }}
      TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ minHeight: "10px" }}
        aria-controls="panel1a-content">
        <Grid container spacing={2}>
          <Grid item xs="auto">
            {!open 
               ? <Avatar {...stringAvatar(item.UserName)} />
               : <Typography>「{item.UserName}」を編集</Typography>
            }
          </Grid>
          <Grid item xs>
            <Box>
              {!open && (
                <Stack>
                  <Typography sx={{ mb: 1 }} variant="subtitle1">{isNew ? "新規" : item.UserName}</Typography>

                  <>
                    <Stack direction="row" alignItems="center">
                      <EmailIcon color="action" />
                      <span>{item.MailDeli ? "配信あり" : "対象外"}</span>
                    </Stack>
                    <Fragment>{item.MailAddress}</Fragment>
                  </>

                </Stack>
              )}
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
              value={userName}
              onChange={e => setUserName(e.target.value)}
            />
            <CustomTextField
              variant="filled"
              label="メールアドレス"
              value={mailAddress}
              onChange={e => setMailAddress(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={mailDeli}
                  onChange={(e) => setMailDeli(e.target.checked)} />
              }
              label={"メール配信" + (mailDeli ? "する" : "しない")}
            />
          </Stack>
          <Box sx={{ mt: 1, textAlign: "right" }}>
            <Button variant="contained">{isNew ? "登録" : "更新"}</Button>
            {isNew
              ? <Button variant="outlined" sx={{ mx: 1 }}>キャンセル</Button>
              : <Button variant="contained" color="error" sx={{ mx: 1 }}>削除</Button>
            }
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

UserAccodion.propTypes = {
  user: PropTypes.object.isRequired,
  newData: PropTypes.bool,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
};

export default UserAccodion;
