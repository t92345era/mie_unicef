import AddIcon from '@mui/icons-material/Add';
import { Alert, AlertColor, Box, Fab, Snackbar, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { APP_PAGE_TILE } from '../redux/modules/app';
import { RootState } from '../redux/modules/root';
import { FETCH_ALL_USERS, FETCH_ALL_USERS_FULFILLED, User } from '../redux/modules/user';
import UserAccodion from './UserAccodion';

// 共通テキストボックススタイル
const CustomTextField = styled(TextField)({
  width: "100%"
});

/**
 * 受信
 */
function UserList() {

  const users = useSelector((state: RootState) => state.user.allUsers);
  const loading = useSelector((state: RootState) => state.user.loading);
  //const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const [addUser, setAddUser] = useState<User | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    severity: "success" as AlertColor,
    message: ""
  });

  // 初期表示
  useEffect(() => {
    dispatch(({ type: APP_PAGE_TILE, payload: "ユーザーメンテ" }));
    dispatch(({ type: FETCH_ALL_USERS_FULFILLED , payload: []}));
    dispatch(({ type: FETCH_ALL_USERS }));
  }, []);

  /**
   * ユーザー追加の＋ボタンクリック
   */
  function handleAddUser() {
    setAddUser({
      id: "", MailAddress: "", MailDeli: false, UserId: "", UserName: "", UserSeq: -1
    });
    setTimeout(() => {
      document.body.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 10);
  }

  /**
   * ユーザー編集アコーディオンのキャンセル
   * @param item ユーザー情報
   */
  function onCancelEdit(item: User) {
    if (!item.id) setAddUser(null);
  }

  /**
   * ユーザー更新後のアクション
   * @param item ユーザー情報
   */
  function onUserUpdate(item: User) {
    setAddUser(null);

    setOpenSnackbar({
      open: true,
      severity: "success",
      message: "保存完了"
    });
  }

  /**
   * ユーザー削除後のアクション
   * @param item ユーザー情報
   */
   function onUserDelete(item: User) {
    setAddUser(null);

    setOpenSnackbar({
      open: true,
      severity: "success",
      message: "削除しました"
    });
  }

  /**
   * リストのクリック
   */
  function onClickList(item: User) {
    // setSelectedMessage(item);
    // setOpen(true);
  }

  return (
    <div>
      {loading && (<Box sx={{m:2}}>読み込み中...</Box>)}
      <Stack sx={{ my: 1 }}>
        {users.map((item, index) => (
          <React.Fragment key={index}>
            <UserAccodion
              user={item}
              onCancel={onCancelEdit}
              onUpdate={onUserUpdate}
              onRemove={onUserDelete} />
          </React.Fragment>
        ))}
        {addUser != null && (
          <UserAccodion
            user={addUser}
            newData={true}
            onUpdate={onUserUpdate}
            onCancel={onCancelEdit} />
        )}
      </Stack>
      <Box sx={{ height: "90px" }}></Box>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        aria-label="add"
        onClick={handleAddUser}>
        <AddIcon />
      </Fab>

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

export default UserList;
