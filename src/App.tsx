import React, { useState } from "react";
import { Button, message, Form, Input, List } from "antd";

import { createStore, bindActionCreators, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { put, takeEvery, delay, all } from "redux-saga/effects";
// @ts-ignore
import { sleep } from "@/utils";

const initialState: {
  list: IListItem[];
} = {
  list: [],
};

const reducer = (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case "add":
      return { ...state, list: [...state.list, payload] };
    default:
      return state;
  }
};

const addTodo = (payload: any) => {
  return {
    type: "add_async",
    payload,
  };
};

// !真实工作的saga，负责业务逻辑
export function* addTodoWorkerSaga(action: any) {
  console.log("action:", action);
  yield delay(1000);
  yield put({ type: "add", payload: action.payload });
}

// ! 监听saga，负责接受一系列的动作
export function* watcherSaga() {
  yield takeEvery("add_async", addTodoWorkerSaga);
}

// ! rootSaga 注册开始的所有saga
function* rootSaga() {
  yield all([watcherSaga()]);
}
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
function Todo(props: any) {
  return <List.Item actions={[<Button>操作</Button>]}>{JSON.stringify(props.data)}</List.Item>;
}

function TodoList(props: any) {
  return (
    <List bordered>
      {props.list?.map((todo: any, index: any) => (
        <Todo data={todo} key={index} />
      ))}
    </List>
  );
}
const ConnectedTodoList = connect((state) => state)(TodoList);

function AddTodoBtn(props: any) {
  console.log("props:", props);
  return (
    <>
      <Form
        onFinish={(values) => {
          props.addTodo(values);
        }}
        style={{ marginTop: "10px" }}
      >
        <Form.Item name="name" label="名字">
          <Input placeholder="请输入todo的名字" />
        </Form.Item>
        <Form.Item name="desc" label="描述">
          <Input placeholder="请输入todo的描述" />
        </Form.Item>
        <Button htmlType="submit">添加</Button>
      </Form>
    </>
  );
}
const ConnectedAddToDo = connect(
  (state) => state,
  (dispatch) => {
    return bindActionCreators({ addTodo }, dispatch);
  }
)(AddTodoBtn);

interface IListItem {
  name: string;
  desc: string;
}
function App() {
  //!把所有的状态管理都放进了store中, 把所有的逻辑放入了actionCreator中
  return (
    <Provider store={store}>
      <div className="app">
        <ConnectedTodoList />
        <ConnectedAddToDo />
      </div>
    </Provider>
  );
}

export default App;
