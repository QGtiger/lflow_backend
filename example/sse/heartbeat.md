在 Server-Sent Events (SSE) 中实现心跳检测通常是为了确保客户端和服务器之间的连接仍然有效，以及在连接断开时能够及时重新建立连接。以下是在 SSE 中实现心跳检测的一些方法：

1. **服务器端定期发送心跳事件**：
   服务器可以定期发送心跳事件到客户端，例如每 30 秒发送一次。客户端监听这些事件，并在收到时重置一个心跳超时计时器。如果一定时间内没有收到心跳事件，客户端可以认为连接已经断开，并尝试重新连接。

   示例代码（服务器端）：

   ```javascript
   setInterval(() => {
     emitter.send(SseEmitter.event().data('heartbeat'));
   }, 30000);
   ```

2. **客户端监听心跳事件**：
   客户端使用 `EventSource` 对象监听服务器发送的心跳事件，并在每次收到心跳时重置一个计时器。如果计时器超时，则客户端可以认为连接已经断开，并采取相应的行动。

   示例代码（客户端）：

   ```javascript
   var eventSource = new EventSource('path/to/sse');
   var timeout = setTimeout(() => {
     console.log('Heartbeat timeout, reconnecting...');
     eventSource.close();
     // 重新连接逻辑
   }, 30000);

   eventSource.onmessage = (event) => {
     if (event.data === 'heartbeat') {
       clearTimeout(timeout);
       timeout = setTimeout(() => {
         console.log('Heartbeat timeout, reconnecting...');
         eventSource.close();
         // 重新连接逻辑
       }, 30000);
     }
   };
   ```

3. **使用 `retry` 属性**：
   SSE 允许服务器在发送事件时包含一个 `retry` 属性，指示客户端在连接断开后多久尝试重新连接。这不是心跳检测，但它可以帮助客户端在连接断开后自动尝试重新连接。

   示例（服务器端设置 `retry`）：

   ```javascript
   emitter.send(SseEmitter.event().data('message').retry(5000));
   ```

4. **客户端错误处理**：
   如果连接断开，客户端的 `EventSource` 对象会触发 `onerror` 事件。客户端可以在 `onerror` 事件中实现重连逻辑。

   示例代码（客户端）：

   ```javascript
   eventSource.onerror = () => {
     console.log('Connection error, reconnecting...');
     eventSource.close();
     // 重新连接逻辑
   };
   ```

5. **结合使用 `onopen` 和 `setTimeout`**：
   在客户端，你可以在连接打开时设置一个 `setTimeout`，并在每次收到消息时重置它。如果在超时时间内没有收到任何消息，那么连接可能已经断开。

   示例代码（客户端）：

   ```javascript
   eventSource.onopen = () => {
     console.log('Connection opened');
     const heartbeatTimeout = setTimeout(() => {
       console.log('Heartbeat timeout, reconnecting...');
       eventSource.close();
       // 重新连接逻辑
     }, 30000);

     eventSource.onmessage = (event) => {
       clearTimeout(heartbeatTimeout);
       heartbeatTimeout = setTimeout(() => {
         console.log('Heartbeat timeout, reconnecting...');
         eventSource.close();
         // 重新连接逻辑
       }, 30000);
     };
   };
   ```

请注意，这些方法可能需要根据你的具体应用场景进行调整。例如，你可能需要调整心跳事件的发送频率，或者在重连逻辑中添加额外的延迟以避免频繁重连。
