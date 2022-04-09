// ! 使用了redux-sga来解决redux中的异步请求问题，同时使用了react-redux的hooks简化组件和store的链接
import React from "react";
import { Button, message, Form, Input, List } from "antd";

import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
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

function TodoList() {
  const list = useSelector((state: any) => state.list);
  return (
    <List bordered>
      {list?.map((todo: any, index: any) => (
        <Todo data={todo} key={index} />
      ))}
    </List>
  );
}

function AddTodoBtn() {
  const dispatch = useDispatch();
  return (
    <>
      <Form
        onFinish={(values) => {
          dispatch({ type: "add_async", payload: values });
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

interface IListItem {
  name: string;
  desc: string;
}
function App() {
  //!把所有的状态管理都放进了store中, 把所有的逻辑放入了actionCreator中
  return (
    <Provider store={store}>
      <div className="app">
        <TodoList />
        <AddTodoBtn />
      </div>
    </Provider>
  );
}

export default App;
