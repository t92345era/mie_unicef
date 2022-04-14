import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Box, Button, Card, Chip, Dialog, DialogContent, DialogTitle, Grid, IconButton, List, ListItem, Paper, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { MAIL_HIS_ONE } from '../redux/modules/user';
import { RootState } from '../redux/modules/root';

import { useState } from 'react';

const CustomTextField = styled(TextField)({
  width: "100%"
});


// 本文ボックスのスタイルコンポーネント
const BodyBox = styled(Box)((props) => ({
  backgroundColor: "rgba(0, 0, 0, 0.06)",
  padding: "1ch",
  borderBottom: "1px solid #333",
  [props.theme.breakpoints.up("sm")]: {
    width: "500px",
  },
  '& .scrollText': {
    height: "20rem", 
    overflowY: "scroll", 
    paddingTop: "0.5ch"
  }
}));

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
function MessageDialog(props: any) {

  // プロパティの受け取り
  const { onClose, open, srKbn, ems } = props;

  const mailHis = useSelector((state: RootState) => state.user.mailHis);
  const [isHtml, setIsHtml] = React.useState(false);
  const [body, setBody] = React.useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  // ダイアログクローズ
  const handleClose = () => {
    if (typeof (onClose) === "function") {
      onClose();
    }
  };

  // 初期表示
  useEffect(() => {
    //console.log(`useEffect srKbn=${srKbn}  ems=${ems}`)
    if (ems) {
      dispatch(({ type: MAIL_HIS_ONE, payload: { srKbn: srKbn, ems: ems } }));
    }
  }, [ems]);

  // メール履歴が変わった時の処理
  useEffect(() => {
    console.log("change", mailHis);
    //setBody(mailHis?.plainText ?? "")
    if (mailHis && mailHis.html) {
      setIsHtml(true);
      setBody(mailHis.html);
      // var divContainer = document.createElement("div");
      // console.log(mailHis.html)
      // divContainer.innerHTML = mailHis.html;
      // setBody(divContainer.textContent || divContainer.innerText || "");
    } else {
      setIsHtml(false);
      const wk = (mailHis?.plainText ?? "").replaceAll(/\r\n/g, "<br>").replaceAll(/\r/g, "<br>").replaceAll(/\n/g, "<br>");
      console.log(body)
      setBody(wk);
    }

  }, [mailHis]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullScreen={fullScreen}>
      <DialogTitle sx={{ ...titleStyle }}>
        <span>メール</span>
        <Button variant="contained" color="secondary" onClick={handleClose}>CLOSE</Button>
      </DialogTitle>
      <DialogContent >
        <Box>
          <Stack spacing={2}>
            <div>
              {mailHis?.timeDisp}
            </div>
            <div>
              <Box sx={{ borderBottom: 1, borderColor: 'grey.500', pb: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}>
                  <Typography variant="subtitle2">
                    {srKbn == "R" ? "送信者" : "宛先"}
                  </Typography>
                  {srKbn == "R"
                    ? <Chip label={`${mailHis?.fromName} (${mailHis?.from})`} />
                    : mailHis?.to.map((item, index) => (
                      <Chip key={index} label={item.name} />
                    ))
                  }
                </Stack>
              </Box>
            </div>
            <div>
              <CustomTextField
                label="件名"
                variant="filled"
                inputProps={{ readOnly: true }}
                value={mailHis?.subject ?? ""}
              />
            </div>
            <div>
              <BodyBox>
                <Typography variant="caption">本文</Typography>
                <Box className="scrollText" sx={
                  { height: "10rem", overflowY: "scroll", pt: 0.5 }
                }>
                  <div dangerouslySetInnerHTML={{ __html: body }}></div>
                </Box>
              </BodyBox>
              {/* <CustomTextField
                label="本文"
                variant="filled"
                multiline
                value={body}
                minRows={10}
                maxRows={30}
              /> */}
            </div>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

MessageDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  srKbn: PropTypes.string.isRequired,
  ems: PropTypes.number.isRequired,
};

export default MessageDialog;

