import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { APP_PAGE_TILE } from './redux/modules/app';

/**
 * 受信
 */
function Error404() {

  const dispatch = useDispatch();

  // 初期表示
  useEffect(() => {
    dispatch(({ type: APP_PAGE_TILE, payload: "404 Page not found" }));
  }, []);

  return (
    <Box sx={{ p: 2}}>
      <h2>404</h2>
      <p>ページが見つかりません。</p>
    </Box>
  );
}

export default Error404;
