import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, AlertColor, LinearProgress, Snackbar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { catchError, finalize, map, of } from 'rxjs';
import { APP_PAGE_TILE } from '../redux/modules/app';
import { RootState } from '../redux/modules/root';
import { FETCH_USERS, User } from '../redux/modules/user';
import { AwsApiClient, MailMessage } from '../util/AwsApiClient';

// 共通テキストボックススタイル
const CustomTextField = styled(TextField)({
  width: "100%"
});

function Send() {

  const users = useSelector((state: RootState) => state.user.users);
  const appState = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState(new Array<User>());
  const [openSnackbar, setOpenSnackbar] = React.useState({
    open: false,
    severity: "success" as AlertColor,
    message: ""
  });
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [errors, setErrors] = React.useState({} as { [name: string]: string });

  // 初期表示
  useEffect(() => {
    dispatch(({ type: APP_PAGE_TILE, payload: "メール送信" }));
    dispatch(({ type: FETCH_USERS }));
  }, []);

  // 宛先変更時のイベント
  const handleChange = (event: any, value: User[]) => setSelectedOptions(value);

  // 送信
  const handleSend = () => {
    const err: { [name: string]: string } = {};
    let hasError = false;
    if (selectedOptions.length == 0) {
      err["to"] = "宛先が指定されていません。";
      hasError = true;
    }
    if (!subject) {
      err["subject"] = "件名が指定されていません。";
      hasError = true;
    }
    if (!body) {
      err["body"] = "本文が指定されていません。";
      hasError = true;
    }

    //入力エラー情報の設定
    setErrors(err);

    if (!hasError) {
      setLoading(true);
      setOpen(true);
    }
  };

  // 送信開始
  const handleSendExecut = () => {
    let toList = selectedOptions.map(n => ({
      address: n.MailAddress,
      name: n.UserName
    }));

    let allSend = toList.filter(n => n.address == "ALL").length >= 1;

    // ALLを選択している場合は、全員に送信
    if (allSend) {
      toList = users.filter(n => n.MailAddress != "ALL").map(n => ({
        address: n.MailAddress,
        name: n.UserName
      }));
    }

    const msg: MailMessage = {
      to: toList,
      allSend: allSend,
      subject: subject,
      body: body
    };

    //ダイアログを閉じる
    setOpen(false);

    //メール送信
    AwsApiClient.sendMail(msg, appState.authHash).pipe(
      map(rs => {
        //console.log(rs.response);
        return { success: true, message: "送信完了" }
      }),
      catchError(err => {
        console.log("error", err);
        return of({ success: false, message: err?.response["message"] ?? "ERROR" });
      }),
      finalize(() => {
        setLoading(false);
      })
    ).subscribe({
      next: (data) => {
        setOpenSnackbar({
          open: true,
          severity: data.success ? "success" : "error",
          message: data.message
        });
      }
    });
  };

  // ダイアログでキャンセルボタン
  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  // 宛先に選択された人数を返す
  const sendUserCount = () => {
    if (selectedOptions.find(n => n.id == "ALL")) {
      return users.length;
    } else {
      return selectedOptions.length;
    }
  };

  return (
    <div>
      <CssBaseline />
      <Box>
        {loading && <LinearProgress color="secondary" />}
      </Box>
      <Container component="main">
        <Box>
          <Stack spacing={2} sx={{ mt: "2ch" }}>
            <div>
              <Autocomplete
                multiple
                id="tags-standard"
                options={users}
                getOptionLabel={(option) => option.UserName}
                defaultValue={[]}
                loadingText="loading..."
                onChange={handleChange}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.UserName} ({option.MailAddress})
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={"to" in errors}
                    label="宛先"
                    placeholder="宛先を入力"
                  />
                )}
              />
              {errors["to"] && (
                <p className="error">{errors["to"]}</p>
              )}
            </div>
            <div>
              <CustomTextField
                id="standard-basic"
                variant="filled"
                error={"subject" in errors}
                label="件名"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              {errors["to"] && (
                <p className="error">{errors["subject"]}</p>
              )}
            </div>
            <div>
              <CustomTextField
                id="outlined-multiline-flexible"
                label="本文"
                error={"body" in errors}
                multiline
                variant="filled"
                minRows={10}
                maxRows={30}
                value={body}
                onChange={e => setBody(e.target.value)}
              />
              {errors["to"] && (
                <p className="error">{errors["body"]}</p>
              )}
            </div>
          </Stack>
          <Stack
            sx={{ mt: "4ch" }}
            direction="row">
            <LoadingButton
              onClick={handleSend}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              {loading
                ? <span>送信中（送信完了までそのままで...）</span>
                : <span>送信</span>
              }
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"送信確認"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {sendUserCount()}人を対象にメールを送信します。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSendExecut} autoFocus>
            送る！！
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={openSnackbar.open}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar({...openSnackbar, open: false})}>
        <Alert 
          onClose={() => setOpenSnackbar({...openSnackbar, open: false})} 
          severity={openSnackbar.severity} sx={{ width: '100%' }}>
          {openSnackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Send;
