import { act } from "react-dom/test-utils";
import { ofType, StateObservable } from "redux-observable";
import { map, mergeMap } from "rxjs";
import { ajax } from "rxjs/ajax";
import { isJSDocReturnTag } from "typescript";
import { AwsApiClient } from "../../util/AwsApiClient";
import { RootState } from "./root";

// interface
export interface UserState {
  users: User[],
  receiveList: Message[],
  sendList: Message[],
  mailHis: Message | null,
}
export interface User {
  id: string,
  MailAddress: string,
  MailDeli: boolean
  UserId: string,
  UserName: string,
  UserSeq: number,
}
export interface Message {
  pkey: string,
  ems: number,
  subject: string,
  html: string,
  plainText: string,
  from: string,
  srKbn: string,
  fromName: string,
  to: {
    address: string,
    name: string
  }[],
  mailId: string,
  timeDisp: string
}

// ユーザー一覧取得 アクションクリエイター
export const FETCH_USERS = "user/FETCH_USERS";
export const FETCH_USERS_FULFILLED = "user/FETCH_USERS_FULFILLED";

// ユーザー登録更新 アクションクリエイター
export const UPDATE_USER = "user/UPDATE_USER";
export const UPDATE_USER_FULFILLED = "user/UPDATE_USER_FULFILLED";

// メール送信 アクションクリエイター
export const SEND_MAIL = "user/SEND_MAIL";
export const SEND_MAIL_FULFILLED = "user/SEND_MAIL_FULFILLED";

// メール受信履歴取得 アクションクリエイター
export const RECEIVE_LIST = "user/RECEIVE_LIST";
export const RECEIVE_LIST_FULFILLED = "user/RECEIVE_LIST_FULFILLED";

// メール送信履歴取得 アクションクリエイター
export const SEND_LIST = "user/SEND_LIST";
export const SEND_LIST_FULFILLED = "user/SEND_LIST_FULFILLED";

// メール履歴１件取得
export const MAIL_HIS_ONE = "user/MAIL_HIS_ONE";
export const MAIL_HIS_ONE_FULFILLED = "user/MAIL_HIS_ONE_FULFILLED";

// initial state
const initialState: UserState = { users: [], receiveList: [], sendList: [], mailHis: null };

// reducer
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_USERS_FULFILLED:
      //console.log(action.payload)
      return { ...state, users: action.payload }
    case UPDATE_USER_FULFILLED:
      const updateUsers = (action.payload || []) as User[];

      const newUsers = state.users.map(u => {
        const i = updateUsers.findIndex(n => n.id == u.id);
        const findUser = updateUsers.splice(i, 1);
        return i >= 0 ? findUser : u;
      })
      return { ...state, users: newUsers.concat(updateUsers) }
    case RECEIVE_LIST_FULFILLED:
      //console.log(action.payload)
      return { ...state, receiveList: action.payload }
    case SEND_LIST_FULFILLED:
      //console.log(action.payload)
      return { ...state, sendList: action.payload }
    case MAIL_HIS_ONE_FULFILLED:
      //console.log(action.payload)
      return { ...state, mailHis: action.payload }
    default:
      return state
  }
};

// ユーザー一覧取得
export const fetchUserEpic = (action$: any, state$: any) => action$.pipe(
  ofType(FETCH_USERS),
  mergeMap(action => {
    //console.log(state$);
    return AwsApiClient.getUsers(true, state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => ({ type: FETCH_USERS_FULFILLED, payload: response }))
      )
  })
);

// ユーザー登録
export const updateUserEpic = (action$: any, state$: any) => action$.pipe(
  ofType(UPDATE_USER),
  mergeMap((action: any) => {
    //console.log(state$);
    return AwsApiClient.insUpUser(action.payload, state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => ({ type: UPDATE_USER_FULFILLED, payload: response }))
      )
  })
);

// 受信履歴取得
export const receiveListEpic = (action$: any, state$: any) => action$.pipe(
  ofType(RECEIVE_LIST),
  mergeMap(action =>
    AwsApiClient.mailHis("R", state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => ({ type: RECEIVE_LIST_FULFILLED, payload: response }))
      )
  )
);

// 送信履歴取得
export const sendListEpic = (action$: any, state$: any) => action$.pipe(
  ofType(SEND_LIST),
  mergeMap(action =>
    AwsApiClient.mailHis("S", state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => ({ type: SEND_LIST_FULFILLED, payload: response }))
      )
  )
);

// メール履歴１件取得
export const mailHisOneEpic = (action$: any, state$: any) => action$.pipe(
  ofType(MAIL_HIS_ONE),
  mergeMap((action: any) =>
    AwsApiClient.mailHisOne(action.payload, state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => {
          if (Array.isArray(response) && response.length > 0) {
            return ({ type: MAIL_HIS_ONE_FULFILLED, payload: response[0] })
          } else {
            return null;
          }
        })
      )
  )
);

export default reducer;