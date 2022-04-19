import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Fab, FormControlLabel, Grid, Stack, Switch, TextField, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map, Subscription } from 'rxjs';
import { RootState } from '../redux/modules/root';
import { DELETE_USER_FULFILLED, UPDATE_USER_FULFILLED, User } from '../redux/modules/user';
import { AwsApiClient } from '../util/AwsApiClient';

// 共通テキストボックススタイル
const CustomTextField = styled(TextField)({
  width: "100%"
});

/**
 * 受信
 */
function UserAccodion(props: any) {

  const appState = useSelector((state: RootState) => state.app);
  const isNew = props.newData ?? false;
  const [open, setOpen] = useState(isNew);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const item = props.user as User;
  const [userName, setUserName] = useState(item.UserName);
  const [mailAddress, setMailAddress] = useState(item.MailAddress);
  const [mailDeli, setMailDeli] = useState(item.MailDeli);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({} as { [name: string]: string });
  const dispatch = useDispatch();
  let sub: Subscription | null = null;

  useEffect(() => {
    return (): void => {

    };
  }, []);

  /**
   * リストのアイコンマーク文字取得
   */
  function stringAvatar(name: string) {
    return {
      children: !isNew && name && name.length > 0 ? name[0] : "-",
    };
  }

  /**
   * 登録・更新ボタン押下
   */
  function onClickRegister() {
    const err: { [name: string]: string } = {};
    let hasError = false;
    if (!userName) {
      err["userName"] = "氏名が入力されていません。";
      hasError = true;
    }
    if (mailDeli) {
      if (!mailAddress) {
        err["mailAddress"] = "メールアドレスが指定されていません。";
        hasError = true;
      }
    }

    if (mailAddress) {
      const pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
      if (!pattern.test(mailAddress)) {
        err["mailAddress"] = "メールアドレスの形式が正しくありません。";
        hasError = true;
      }
    }

    //入力エラー情報の設定
    setErrors(err);
    if (hasError) return;

    const upUser = {
      ...item,
      UserName: userName,
      MailAddress: mailAddress,
      MailDeli: mailDeli,
    };

    //登録・更新API実行
    setUpdating(true);
    sub = AwsApiClient.insUpUser(upUser, appState.authHash)
      .pipe(
        map(r => r.response)
      )
      .subscribe({
        next(response) {
          dispatch({ type: UPDATE_USER_FULFILLED, payload: response });
          if (typeof props.onUpdate === "function") {
            console.log("onUpdate")
            setUpdating(false);
            setOpen(false);
            props.onUpdate(upUser);
          }
        },
        error(err) {
          console.log(err);
          setUpdating(false);
          setMessage("エラーが発生。" + err);
        }
      });
  }

  /**
   * 削除ボタン押下
   */
  function onClickDelete() {
    if (!window.confirm("ほんまに削除しますか？")) {
      return;
    }

    //削除API実行
    setDeleting(true);
    sub = AwsApiClient.deleteUser(item, appState.authHash)
      .pipe(
        map(r => r.response)
      )
      .subscribe({
        next(response) {

          setDeleting(false);
          if (typeof props.onRemove === "function") {
            console.log("onUpdate")
            dispatch({ type: DELETE_USER_FULFILLED, payload: response });
            props.onRemove(item);
          }
        },
        error(err) {
          console.log(err);
          setDeleting(false);
          setMessage("エラーが発生。" + err);
        }
      });
  }

  /**
   * キャンセルボタン押下
   */
  function onClickCancel() {
    onChangeExpand(null, false);
  }

  /**
   * 
   * @param e イベント
   * @param o 開閉状態
   */
  function onChangeExpand(e: any, o: boolean) {
    setOpen(o);
    if (!o && typeof props.onCancel === "function") {
      console.log("onChangeExpand")
      props.onCancel(item);
    }
  }

  return (
    <Accordion
      expanded={open}
      sx={{ background: open ? "#F5F5F5" : "#fff" }}
      onChange={onChangeExpand}
      TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ minHeight: "10px" }}
        aria-controls="panel1a-content">
        <Grid container spacing={2}>
          <Grid item xs="auto">
            {!open
              ? <Avatar {...stringAvatar(item.UserName)} />
              : <Typography>{!isNew ? <>「{item.UserName}」を編集</> : <>新規ユーザーの作成</>}</Typography>
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
              error={"userName" in errors}
              onChange={e => setUserName(e.target.value)}
            />
            {errors["userName"] && (
              <p className="error">{errors["userName"]}</p>
            )}
            <CustomTextField
              variant="filled"
              label="メールアドレス"
              error={"mailAddress" in errors}
              value={mailAddress}
              onChange={e => setMailAddress(e.target.value)}
            />
            {errors["mailAddress"] && (
              <p className="error">{errors["mailAddress"]}</p>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={mailDeli}
                  onChange={(e) => setMailDeli(e.target.checked)} />
              }
              label={"メール配信" + (mailDeli ? "する" : "しない")}
            />
          </Stack>
          {message &&
            <Box>
              <Typography sx={{ color: "red" }}>{message}</Typography>
            </Box>}
          <Box >

            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              {/* キャンセル */}
              {isNew && (
                <Button
                  variant="outlined"
                  onClick={onClickCancel}
                  sx={{ mx: 1 }}>キャンセル</Button>
              )}
              {/* 保存ボタン */}
              <Box sx={{ m: 1, position: 'relative' }}>
                <Fab
                  aria-label="save"
                  color="primary"
                  disabled={updating}
                  onClick={onClickRegister}>
                  <SaveIcon />
                </Fab>
                {updating && (
                  <CircularProgress
                    size={68}
                    sx={{
                      color: green[500],
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>

              {/* 削除ボタン */}
              {!isNew && (
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Fab
                    aria-label="save"
                    color="error"
                    disabled={deleting}
                    onClick={onClickDelete}>
                    <DeleteIcon />
                  </Fab>
                  {deleting && (
                    <CircularProgress
                      size={68}
                      sx={{
                        color: red[500],
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

UserAccodion.propTypes = {
  user: PropTypes.object.isRequired,
  newData: PropTypes.bool,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
};

export default UserAccodion;
