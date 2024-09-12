https://zhuanlan.zhihu.com/p/672952412

https://www.ruoduan.cn/nest-sse/

在 NestJS 中，你可以使用 Server-Sent Events (SSE) 来实现服务器向客户端的实时数据推送。SSE 是一种允许服务器主动向客户端发送事件的技术，它使用标准的 HTTP 协议，但与普通的 HTTP 请求不同，SSE 允许服务器通过一个持久的连接不断地发送消息给客户端。

以下是如何使用 SSE 以及如何精准推送给某个用户的示例代码：

### 1. 创建 SSE 控制器

首先，你需要创建一个控制器来处理 SSE 请求。

```typescript
import { Controller, Get, Sse, Header, Param } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller('sse')
export class SseController {
  @Get(':userId')
  @Header('Content-Type', 'text/event-stream')
  @Sse()
  sse(@Param('userId') userId: string): Observable<any> {
    // 这里可以根据 userId 来获取特定用户的数据
    // 并将其发送给订阅了这个 userId SSE 流的客户端
    const data = { message: `Data for user ${userId}` };
    return of(data);
  }
}
```

### 2. 前端订阅 SSE

在客户端，你可以使用 JavaScript 的 `EventSource` 接口来订阅服务器发送的事件。

```javascript
const userId = 'some-user-id'; // 假设这是从登录信息中获取的用户 ID
const eventSource = new EventSource(`http://localhost:3000/sse/${userId}`);

eventSource.onmessage = (event) => {
  console.log('New message:', event.data);
};

eventSource.onerror = (error) => {
  console.error('EventSource failed:', error);
};
```

### 3. 精准推送给某个用户

为了精准推送给某个用户，你可以在服务器端维护一个用户到 SSE 连接的映射。当有数据需要推送给特定用户时，你可以通过这个映射找到对应的 SSE 连接并发送数据。

```typescript
// 假设你有一个服务来管理 SSE 连接
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

@Injectable()
export class SseService {
  private readonly events = new EventEmitter();

  emitToUser(userId: string, data: any): void {
    // 检查用户是否在线，并发送数据
    this.events.emit(`user-${userId}`, data);
  }

  subscribeToUser(userId: string, callback: (data: any) => void): void {
    this.events.on(`user-${userId}`, callback);
  }
}
```

在控制器中，你可以使用这个服务来发送数据：

```typescript
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get(':userId')
  sse(@Param('userId') userId: string, @Sse() sse: any) {
    this.sseService.subscribeToUser(userId, (data) => {
      sse.json(data);
    });
  }
}
```

这样，每当有数据需要推送给特定用户时，你只需要调用 `emitToUser` 方法，数据就会被发送到该用户的客户端。

请注意，这些代码示例提供了一个基本的 SSE 实现框架，你可能需要根据你的具体需求进行调整和完善。例如，你可能需要处理用户连接的生命周期事件，以及在用户断开连接时清理资源。
