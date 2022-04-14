import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs";
import { ajax } from "rxjs/ajax";

// interface
export interface TodoState {
  todos: Todo[]
}
export interface Todo {
  title: string,
  completed: boolean
}

// action creators
export const FETCH_TODO = "todo/FETCH_TODO";
export const FETCH_TODO_FULFILLED = "todo/FETCH_TODO_FULFILLED";

// initial state
const initialState: TodoState = { todos: []};

// reducer
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_TODO_FULFILLED:
      return { todos: action.payload }
    default:
      return state
  }
};

// epic
export const fetchTodoEpic = (action$: any) => action$.pipe(
  ofType(FETCH_TODO),
  mergeMap(action =>
    ajax.getJSON(`https://jsonplaceholder.typicode.com/posts`).pipe(
      map(rs => {
        //console.log(rs);
        return rs;
      }),
      map(response => ({ type: FETCH_TODO_FULFILLED, payload: response }))
    )
  )
);

export default reducer;