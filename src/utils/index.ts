// 这里表示add的操作是一个异步操作，模拟插入数据库
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
