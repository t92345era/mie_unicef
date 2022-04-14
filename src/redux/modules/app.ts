// interface
export interface AppState {
  pageTitle: string,
  login: boolean,
  authHash: string,
}

// ユーザー一覧取得 アクションクリエイター
export const APP_PAGE_TILE = "app/PAGE_TITLE";
export const APP_LOGIN = "app/APP_LOGIN";
export const APP_AUTH_HASH = "app/APP_AUTH_HASH";

// initial state
const initialState: AppState = { pageTitle: "", login: false, authHash: "" };

// reducer
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case APP_PAGE_TILE:
      return { ...state, pageTitle: action.payload }
    case APP_LOGIN:
      return { ...state, login: action.payload }
    case APP_AUTH_HASH:
      return { ...state, authHash: action.payload }
    default:
      return state
  }
};

export default reducer;