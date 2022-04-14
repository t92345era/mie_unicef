import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import todo, { fetchTodoEpic, TodoState } from './todo';
import user, { 
  fetchUserEpic, 
  updateUserEpic,
  receiveListEpic, 
  sendListEpic, 
  mailHisOneEpic,
  UserState } from './user';
import app, { AppState } from './app';

export interface RootState {
  todo: TodoState,
  user: UserState,
  app: AppState
}

export const rootEpic = combineEpics(
  fetchTodoEpic,
  updateUserEpic,
  fetchUserEpic,
  receiveListEpic,
  mailHisOneEpic,
  sendListEpic,
);

export const rootReducer = combineReducers({
  todo,
  user,
  app
});