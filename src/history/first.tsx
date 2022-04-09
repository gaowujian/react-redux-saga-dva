// ! 只使用react进行状态的管理和组件的渲染
import React, { useState } from "react";
import { Button, message, Form, Input, List } from "antd";
// @ts-ignore
import { sleep } from "@/utils";

function Todo(props: any) {
  console.log("props:", props);
  return <List.Item actions={[<Button>操作</Button>]}>{JSON.stringify(props.data)}</List.Item>;
}

function TodoList(props: any) {
  console.log("props:", props);
  return (
    <List bordered>
      {props.list.map((todo: any, index: any) => (
        <Todo data={todo} key={index} />
      ))}
    </List>
  );
}

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

interface IListItem {
  name: string;
  desc: string;
}
function App() {
  const [list, setList] = useState<IListItem[]>([]);
  console.log("list:", list);
  const addTodo = (item: IListItem) => {
    sleep(1000).then(() => {
      setList([...list, item]);
      message.success("添加成功");
    });
  };
  return (
    <div className="app">
      <TodoList list={list} />
      <AddTodoBtn addTodo={addTodo} />
    </div>
  );
}

export default App;
