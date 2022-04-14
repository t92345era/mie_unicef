import LoginIcon from '@mui/icons-material/Login';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Cookies from 'js-cookie';
import jsSHA from 'jssha';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { APP_AUTH_HASH, APP_LOGIN } from '../redux/modules/app';
import { AwsApiClient } from '../util/AwsApiClient';

const CustomTextField = styled(TextField)({
  width: "100%"
});

const titleStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: '#333',
  '& *': {
    fontWeight: 'bold',
    color: '#fff'
  }
}

/**
 * メールメッセージを表示するダイアログコンポーネント
 */
function LoginDialog(props: any) {

  // プロパティの受け取り
  const { onClose, open, srKbn, ems } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [userId, setUserId] = useState("")
  const [pass, setPass] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // ダイアログクローズ
  const handleClose = () => {
    if (typeof (onClose) === "function") {
      onClose();
    }
  };

  // ログインボタン
  const handleLogin = () => {
    setLoading(true);
    const shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(userId + pass);
    const hash = shaObj.getHash("HEX");

    AwsApiClient.authCheck(hash).subscribe({
      next(result) {
        if (result) {
          dispatch(({ type: APP_LOGIN, payload: true }));
          dispatch(({ type: APP_AUTH_HASH, payload: hash }));
          Cookies.set('authkey', hash, { expires: 2 }); //2日後に消える
          handleClose();
        } else {
          setMessage("IDまたはPASSが不正です")
        }
      },
      error(err) { console.error('something wrong occurred: ' + err); },
      complete() { setLoading(false) }
    });
  }

  // 初期表示
  useEffect(() => {
    //console.log(`useEffect srKbn=${srKbn}  ems=${ems}`)
  }, []);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullScreen={fullScreen}>
      <DialogTitle sx={{ ...titleStyle }}>
        <span>ログイン</span>
        <Button variant="contained" color="secondary" onClick={handleClose}>CLOSE</Button>
      </DialogTitle>
      <DialogContent >
        <Box sx={{ pt: 2, width: { sm: 300 } }}>
          <Stack spacing={2}>
            <TextField
              label="ID"
              variant="filled"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <TextField
              label="Password"
              variant="filled"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </Stack>

          <Box sx={{ mt: 2 }}>
            {message &&
              <Box sx={{ color: "red" }}>
                {message}
              </Box>
            }

            <LoadingButton
              onClick={handleLogin}
              loading={loading}
              endIcon={<LoginIcon />}
              disabled={!(userId && pass)}
              loadingPosition="end"
              variant="contained"
            >
              {loading
                ? <span>ログイン中...</span>
                : <span>ログイン</span>
              }
            </LoadingButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

LoginDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default LoginDialog;

