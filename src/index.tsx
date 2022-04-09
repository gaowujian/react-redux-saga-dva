import "./index.less";
import { Button, Form, Input, List } from "antd";

import dva, { connect } from "dva";
import { Route, Router } from "dva/router";
import { sleep } from "./utils";

const app = dva();
app.model({
  namespace: "todo",
  state: { list: [] },
  reducers: {
    add(state, action) {
      return { ...state, list: [...state.list, action.payload] };
    },
  },
  effects: {
    *asyncAdd(action, { call, put }) {
      yield call(sleep, 500);
      yield put({ type: "add", payload: action.payload });
    },
  },
});

function Todo(props: any) {
  return <List.Item actions={[<Button>操作</Button>]}>{JSON.stringify(props.data)}</List.Item>;
}

const TodoList = (props: any) => {
  console.log("props:", props);
  return (
    <List bordered>
      {props.list?.map((todo: any, index: any) => (
        <Todo data={todo} key={index} />
      ))}
    </List>
  );
};
const ConnectedTodoList = connect((state: any) => state.todo)(TodoList);

const AddTodoBtn = (props: any) => {
  console.log("props:", props);
  return (
    <>
      <Form
        onFinish={(values) => {
          props.dispatch({ type: "todo/asyncAdd", payload: values });
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
};

const ConnectedBtn = connect((state: any) => {
  console.log("state:", state);
  return state;
})(AddTodoBtn);

interface IListItem {
  name: string;
  desc: string;
}
function App() {
  //!把所有的状态管理都放进了store中, 把所有的逻辑放入了actionCreator中
  return (
    <div className="app">
      <ConnectedTodoList />
      <ConnectedBtn />
    </div>
  );
}

app.router((router) => {
  return (
    <Router history={router?.history!}>
      <Route path="/" exact component={App} />
    </Router>
  );
});

app.start("#root");

// export default App;
