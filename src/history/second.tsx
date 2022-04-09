// ! react只负责UI的渲染，不负责状态的管理和业务逻辑
// 所有的状态管理在store中，具体是reducer
// 所有的业务所及放在actionCreator中，派发不同的action

import React, { useState } from "react";
import { Button, message, Form, Input, List } from "antd";

import { createStore, bindActionCreators } from "redux";
import { Provider, connect } from "react-redux";
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
  // !把复杂的业务逻辑放在action creator里面,
  // await sleep(1000);
  return {
    type: "add",
    payload,
  };
};

const store = createStore(reducer);
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

    // return {
    //   addTodo(item: any) {
    //     dispatch(addTodo(item));
    //   },
    // };
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
