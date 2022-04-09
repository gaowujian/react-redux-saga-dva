import React from "react";
import { Button, message } from "antd";

function App() {
  return (
    <div className="app">
      <h1>Welcome</h1>
      <Button
        onClick={() => {
          message.success("欢迎来到tony的cra模板");
        }}
      >
        点击
      </Button>
    </div>
  );
}

export default App;
