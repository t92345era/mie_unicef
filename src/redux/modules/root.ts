import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import todo, { fetchTodoEpic, TodoState } from './todo';

export interface RootState {
  todo: TodoState
}

export const rootEpic = combineEpics(
  fetchTodoEpic,
);

export const rootReducer = combineReducers({
  todo,
});