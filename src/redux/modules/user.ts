import { act } from "react-dom/test-utils";
import { ofType, StateObservable } from "redux-observable";
import { concat, map, mergeMap, of, interval, takeWhile, finalize } from "rxjs";
import { ajax } from "rxjs/ajax";
import { isJSDocReturnTag } from "typescript";
import { AwsApiClient } from "../../util/AwsApiClient";
import { RootState } from "./root";

// interface
export interface UserState {
  users: User[],
  allUsers: User[],
  receiveList: Message[],
  sendList: Message[],
  mailHis: Message | null,
  loading: boolean,
  updateState: string,
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



export const STATE_NO_PROCESS = "NO_PROCESS";
export const STATE_PROCESSING = "PROCESSING";
export const STATE_COMPLETE = "COMPLETE";


// ユーザー一覧取得 アクションクリエイター
export const FETCH_USERS = "user/FETCH_USERS";
export const FETCH_USERS_FULFILLED = "user/FETCH_USERS_FULFILLED";

// ユーザー全権取得アクションクリエイター
export const FETCH_ALL_USERS = "user/FETCH_ALL_USERS";
export const FETCH_ALL_USERS_FULFILLED = "user/FETCH_ALL_USERS_FULFILLED";

// ユーザー登録更新 アクションクリエイター
export const UPDATE_USER = "user/UPDATE_USER";
export const UPDATE_USER_FULFILLED = "user/UPDATE_USER_FULFILLED";

// ユーザー削除 アクションクリエイター
export const DELETE_USER = "user/DELETE_USER";
export const DELETE_USER_FULFILLED = "user/DELETE_USER_FULFILLED";

// ローディング状態更新 アクションクリエイター
export const SET_LODING_STATE = "user/SET_LODING_STATE";

// ステータス更新 アクションクリエイター
export const UPDATE_STATE = "user/UPDATE_STATE";
export const UPDATE_STATE_FULFILLED = "user/UPDATE_STATE_FULFILLED";

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
const initialState: UserState = {
  users: [],
  allUsers: [],
  receiveList: [],
  sendList: [],
  mailHis: null,
  loading: false,
  updateState: STATE_NO_PROCESS
};

// reducer
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_USERS_FULFILLED:
      //console.log(action.payload)
      return { ...state, users: action.payload }
    case FETCH_ALL_USERS_FULFILLED:
      //console.log(action.payload)
      return { ...state, allUsers: action.payload }
    case UPDATE_USER_FULFILLED:
      const updateUsers = (action.payload || []) as User[];
      // 変更ユーザーをマージ
      const newUsers = state.allUsers.map(u => {
        const i = updateUsers.findIndex(n => n.id == u.id);
        const findUser = updateUsers.splice(i, i + 1);
        return findUser.length == 1 ? findUser[0] : u;
      })
      // 登録ユーザーを追加してステートを設定
      return { ...state, allUsers: newUsers.concat(updateUsers) }
    case DELETE_USER_FULFILLED:
      // 削除ユーザーをユーザーリストから削除
      const deleteUsers = (action.payload || []) as { id: string }[];
      const newUsers2 = state.allUsers.filter(user => {
        return deleteUsers.findIndex(n => n.id == user.id) < 0;
      });
      return { ...state, allUsers: newUsers2 }
    case RECEIVE_LIST_FULFILLED:
      //console.log(action.payload)
      return { ...state, receiveList: action.payload }
    case SEND_LIST_FULFILLED:
      //console.log(action.payload)
      return { ...state, sendList: action.payload }
    case MAIL_HIS_ONE_FULFILLED:
      //console.log(action.payload)
      return { ...state, mailHis: action.payload }
    case UPDATE_STATE:
      //console.log(action.payload)
      return { ...state, updateState: action.payload }
    case SET_LODING_STATE:
      console.log("loading", action.payload)
      return { ...state, loading: action.payload }
    default:
      return state
  }
};

// ユーザー一覧取得
export const fetchUserEpic = (action$: any, state$: any) => action$.pipe(
  ofType(FETCH_USERS),
  mergeMap(action =>
    concat(
      of({ type: SET_LODING_STATE, payload: true }),
      AwsApiClient.getUsers(true, true, state$.value.app.authHash)
        .pipe(
          map(rs => rs.response),
          map(response => ({ type: FETCH_USERS_FULFILLED, payload: response }))
        ),
      //of({ type: SET_LODING_STATE, payload: false }),
    )
  )
);

// ユーザー全権取得
export const fetchAllUserEpic = (action$: any, state$: any) => action$.pipe(
  ofType(FETCH_ALL_USERS),
  mergeMap(action => 
    //console.log(state$);
    // return AwsApiClient.getUsers(false, false, state$.value.app.authHash)
    //   .pipe(
    //     map(rs => rs.response),
    //     map(response => ({ type: FETCH_ALL_USERS_FULFILLED, payload: response }))
    //   )

    concat(
      of({ type: SET_LODING_STATE, payload: true }),
      AwsApiClient.getUsers(false, false, state$.value.app.authHash)
        .pipe(
          map(rs => rs.response),
          map(response => ({ type: FETCH_ALL_USERS_FULFILLED, payload: response }))
        ),
      of({ type: SET_LODING_STATE, payload: false }),
    )
  )
);

// ユーザー登録
export const updateUserEpic = (action$: any, state$: any) => action$.pipe(
  ofType(UPDATE_USER),
  mergeMap((action: any) =>
    concat(
      //処理中のものが無くなるまで待機
      interval(100).pipe(
        takeWhile(seq => {
          console.log("updateState", state$.value.user.updateState);
          return state$.value.user.updateState == STATE_PROCESSING;
        }),
        map(n => ({ type: "DUMMY", payload: "" })),
      ),
      //ステータスを処理開始に設定
      of({ type: UPDATE_STATE, payload: STATE_PROCESSING }),
      //AWS通信
      AwsApiClient.insUpUser(action.payload.updateUser, state$.value.app.authHash)
        .pipe(
          map(rs => rs.response),
          map(response => ({ type: UPDATE_USER_FULFILLED, payload: response }))
        ),
      //ステータスを処理完了に設定
      of({ type: UPDATE_STATE, payload: STATE_COMPLETE })
    )
  ),
);

// ユーザー削除
export const deleteUserEpic = (action$: any, state$: any) => action$.pipe(
  ofType(DELETE_USER),
  mergeMap((action: any) => {
    //console.log(state$);
    return AwsApiClient.deleteUser(action.payload, state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => ({ type: DELETE_USER_FULFILLED, payload: response }))
      )
  })
);

// 受信履歴取得
export const receiveListEpic = (action$: any, state$: any) => action$.pipe(
  ofType(RECEIVE_LIST),
  mergeMap(action =>
    concat(
      of({ type: SET_LODING_STATE, payload: true }),
      of({ type: RECEIVE_LIST_FULFILLED, payload: [] }),
      AwsApiClient.mailHis("R", state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => ({ type: RECEIVE_LIST_FULFILLED, payload: response }))
      ),
      of({ type: SET_LODING_STATE, payload: false })
    )
  )
);

// 送信履歴取得
export const sendListEpic = (action$: any, state$: any) => action$.pipe(
  ofType(SEND_LIST),
  mergeMap(action =>
    concat(
      of({ type: SET_LODING_STATE, payload: true }),
      of({ type: SEND_LIST_FULFILLED, payload: [] }),
      AwsApiClient.mailHis("S", state$.value.app.authHash)
      .pipe(
        map(rs => rs.response),
        map(response => ({ type: SEND_LIST_FULFILLED, payload: response }))
      ),
      of({ type: SET_LODING_STATE, payload: false })
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