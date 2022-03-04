import { act } from "react-dom/test-utils";
import { Action, applyMiddleware, createStore, Dispatch } from "redux";
import { combineEpics, createEpicMiddleware, ofType } from "redux-observable";
import { map, mergeMap } from "rxjs";
import { ajax } from "rxjs/ajax";
//import thunk from "redux-thunk";

/**
 * ストアのインターフェイス
 */
export interface AppData {
  count: number,
  todos: Todo[]
}

/**
 * TODOインターフェイス
 */
export interface Todo {
  title: string,
  completed: boolean
}

// 初期値
const initialState: AppData = {
  count: 2,
  todos: []
};

// reducer
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'get_todo':
      return { ...state, todos: action.payload }
    default:
      return state
  }
};

// 非同期通信で Todoを取得
export const getPosts = () => {
  return async (dispatch: Dispatch) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();
    dispatch({
      type: 'get_todo',
      payload: data,
    });
  };
};

export const FETCH_TODO = "@@todo/FETCH_TODO";
export const FETCH_TODO_FULFILLED = "get_todo";

export const fetchUser = () => ({ type: FETCH_TODO});
const fetchUserFulfilled = (payload: any) => ({ type: FETCH_TODO_FULFILLED, payload });

// epic
export const fetchUserEpic = (action$: any) => action$.pipe(
  ofType(FETCH_TODO),
  mergeMap(action =>
    ajax.getJSON(`https://jsonplaceholder.typicode.com/posts`).pipe(
      map(response => fetchUserFulfilled(response))
    )
  )
);

export const rootEpic = combineEpics(
  fetchUserEpic
);

const epicMiddleware = createEpicMiddleware();
const store = createStore(reducer, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);

export default store;