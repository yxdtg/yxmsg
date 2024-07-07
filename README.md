# YxMsg
一个使用TypeScript编写的轻量级发布订阅模式库、支持消息优先级。

## 特性
- 无任何依赖
- 轻量级
- 支持消息优先级

## 安装
请确保已安装Nodejs环境

npm
```bash
npm i yxmsg
```
yarn
```bash
yarn add yxmsg
```
pnpm
```bash
pnpm add yxmsg
```

## 使用
```typescript
// 导入YxMsg
import { YxMsg } from "yxmsg";
// 创建YxMsg实例
const message = new YxMsg();

// 定义消息处理函数
const handler = (data: string) => {
  console.log(data);
};
// 注册消息
message.on("test", handler);

// 发射消息
message.emit("test", "Hello World!");

// 注销消息
message.off("test", handler);
```

## 注册消息
```typescript
// 注册消息
message.on("test", handler);
// 注册消息会返回一个消息id, 可用于注销消息
const id = message.on("test", handler);
// 通过id注销消息
message.off("test", id);

// 注册消息时可以绑定target
const target = {};
message.on("test", handler, target);

// 注册消息时可以设置消息优先级 值越小 越先执行
// 优先级默认为0
message.on("test", () => { console.log("test1") }, null, 1);
message.on("test", () => { console.log("test2") }, null, 2);
message.on("test", () => { console.log("test3") }, target, 3);
// 这里打印结果为 test1 test2 test3
```

## 发送消息
```typescript
// 发射消息
message.emit("test", "Hello World!");
// 发射消息可以携带多个参数
message.emit("test1", "Hello World!", 123, { a: 1, b: 2 });
```

## 注销消息
```typescript
// 注销消息
message.off("test", handler);
// 如果消息注册时绑定了target, 则需要传入target才可以注销
message.off("test", handler, target);

// 通过消息id注销消息
message.off("test", id);
// 注销指定消息类型的所有消息
message.off("test");
```
