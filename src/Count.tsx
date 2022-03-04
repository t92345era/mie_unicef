import React from 'react';
import logo from './logo.svg';
import './App.css';
import { connect, useDispatch, useSelector } from 'react-redux';

function Count() {

  const count = useSelector((state: any) => state.count);
  const dispatch = useDispatch();
  
  const increase = () => {
    dispatch({ type: "increment" });
  };
  const decrease = () => {
    dispatch({ type: "decrement" });
  };

  return (
    <div className="App">
      <div>
        <button onClick={increase}>increase</button>
        <button onClick={decrease}>decrease</button>
      </div>
      <p>Count: {count}</p>
    </div>
  );
}

export default Count;
