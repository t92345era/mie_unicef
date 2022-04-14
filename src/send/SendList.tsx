import { ListItemButton, ListItemSecondaryAction } from '@mui/material';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MessageDialog from '../dialog/MessageDialog';
import { APP_PAGE_TILE } from '../redux/modules/app';
import { RootState } from '../redux/modules/root';
import { Message, User, SEND_LIST } from '../redux/modules/user';

/**
 * 受信
 */
function SendList() {

  const sendList = useSelector((state: RootState) => state.user.sendList);
  const [open, setOpen] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const dispatch = useDispatch();

  const location = useLocation(); 

  // 初期表示
  useEffect(() => {
    dispatch(({ type: APP_PAGE_TILE, payload: "送信済みメール" }));
    dispatch(({ type: SEND_LIST }));
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
   * 表示用の送信先名取得
   * @param item メールメッセージ
   * @returns 表示用の送信先名
   */
  function getToName(item: Message): string {
    let nm = "";
    if (Array.isArray(item.to) && item.to.length > 0) {
      nm = item.to[0].name;
      if (item.to.length > 1) {
        nm += `（他 ${item.to.length - 1}名）`;
      }
    }
    return nm;
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
            primary={getToName(item)}
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
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {sendList.map((item, index) => (
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

export default SendList;
