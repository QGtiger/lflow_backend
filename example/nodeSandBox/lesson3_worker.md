在 Node.js 中，`Worker` 类是 `worker_threads` 模块的一部分，它允许你创建新的线程来执行代码。`__filename` 是一个全局变量，它返回当前被执行的脚本的文件路径。当你创建一个 `Worker` 实例时，你可以传递一个文件名作为第一个参数，这个文件将被用作新线程的启动脚本。

`workerData` 属性是传递给 `Worker` 构造函数的一个选项，它允许你将数据从主线程传递到工作线程。这些数据将在工作线程的 `workerData` 属性中可用。

以下是一个使用 `new Worker(__filename, { workerData: { code } })` 的例子，它展示了如何将代码从主线程传递到工作线程：

**主线程代码（main.js）:**

```javascript
const { Worker, isMainThread } = require('worker_threads');
const { writeFile } = require('fs');
const { join } = require('path');

if (isMainThread) {
  // 要传递给工作线程的代码
  const code = `
    const { workerData } = require('worker_threads');
    console.log('Worker started with code:', workerData.code);
    // 这里可以执行更多的工作线程任务
  `;

  // 将代码转换为字符串并写入文件
  const workerScriptPath = join(__dirname, 'worker.js');
  writeFile(workerScriptPath, code, (err) => {
    if (err) throw err;

    // 创建工作线程
    const worker = new Worker(__filename, { workerData: { code } });

    worker.on('message', (msg) => {
      console.log('Message from worker:', msg);
    });

    worker.on('error', (err) => {
      console.error('Worker error:', err);
    });

    worker.on('exit', (code) => {
      console.log(`Worker stopped with exit code ${code}`);
    });
  });
} else {
  // 工作线程代码
  const { workerData } = require('worker_threads');
  console.log('Worker started with code:', workerData.code);

  // 执行传递的代码
  eval(workerData.code);
}
```

在这个例子中，主线程创建了一个工作线程，并传递了一段代码。这段代码被写入到一个文件中，然后 `Worker` 构造函数使用这个文件创建了工作线程。在工作线程中，我们使用 `eval` 函数来执行传递的代码。请注意，`eval` 应该谨慎使用，因为它会执行任何字符串代码，这可能会导致安全问题。

然而，这并不是一个推荐的做法，因为它涉及到动态地创建和执行代码，这可能会导致安全漏洞。通常，你会将工作线程的代码写入一个单独的文件，并在主线程中引用这个文件，而不是动态地创建代码。

**推荐的使用方式（worker.js）:**

```javascript
// 这是工作线程的代码，它应该在一个单独的文件中
const { workerData } = require('worker_threads');

console.log('Worker started with data:', workerData);

// 执行任务...
```

**主线程代码（main.js）:**

```javascript
const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js', { workerData: { foo: 'bar' } });

worker.on('message', (msg) => {
  console.log('Message from worker:', msg);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

worker.on('exit', (code) => {
  console.log(`Worker stopped with exit code ${code}`);
});
```

在这个推荐的例子中，工作线程的代码被定义在一个单独的文件 `worker.js` 中，主线程通过 `new Worker('./worker.js', { workerData: { foo: 'bar' } })` 创建工作线程，并传递数据。工作线程通过 `workerData` 接收这些数据。这种方式更加安全和清晰。
