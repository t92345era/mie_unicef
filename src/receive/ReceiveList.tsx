import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageDialog from '../dialog/MessageDialog';
import { APP_PAGE_TILE } from '../redux/modules/app';
import { RootState } from '../redux/modules/root';
import { Message, RECEIVE_LIST } from '../redux/modules/user';

/**
 * 受信
 */
function ReceiveList() {

  const loading = useSelector((state: RootState) => state.user.loading);
  const receiveList = useSelector((state: RootState) => state.user.receiveList);
  const [open, setOpen] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const dispatch = useDispatch();

  // 初期表示
  useEffect(() => {
    dispatch(({ type: APP_PAGE_TILE, payload: "受信メール" }));
    dispatch(({ type: RECEIVE_LIST }));
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
   * リストのクリック
   */
  function onClickList(item: Message) {
    setSelectedMessage(item);
    setOpen(true);
  }

  /**
   * リストアイテムの作成
   */
  function createList(item: Message): JSX.Element {
    return (
      <ListItem alignItems="flex-start" onClick={() => onClickList(item)}>
        <ListItemButton>
          <ListItemAvatar>
            <Avatar {...stringAvatar(item.from)} />
          </ListItemAvatar>
          <ListItemText
            primary={item.fromName}
            secondary={
              <React.Fragment>
                {item.subject}
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <span>{item.timeDisp}</span>
          </ListItemSecondaryAction>
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <div>
      {loading && (<Box sx={{m:2}}>読み込み中...</Box>)}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {receiveList.map((item, index) => (
          <React.Fragment key={index}>
            {createList(item)}
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      <MessageDialog 
        open={open}
        onClose={() => setOpen(false)}
        srKbn={selectedMessage?.srKbn ?? ""}
        ems={selectedMessage?.ems ?? 0} />
    </div>
  );
}

export default ReceiveList;
