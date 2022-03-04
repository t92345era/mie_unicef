import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/modules/root';
import { FETCH_TODO } from './redux/modules/todo';

interface Todo {
  title: string,
  completed: boolean
}

function App() {

  const todos = useSelector((state: RootState) => state.todo.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(({ type: FETCH_TODO }));
  }, []);

  return (
    <div className="App">
      <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          <input type="checkbox" checked={todo.completed} name="controlled"></input>
          <span>{todo.title}</span>
        </li>
      ))}
      </ul>
    </div>
  );
}

export default App;
