在 Node.js 环境中执行 JavaScript 代码，并创建沙箱环境以隔离执行代码，可以通过多种方法实现。沙箱环境可以限制代码的执行，防止恶意代码影响系统安全。以下是一些行业最优解：

1. **使用 Child Processes**：
   Node.js 允许你通过 `child_process` 模块创建子进程来执行代码。这样可以在父进程和子进程之间创建隔离。

   ```javascript
   const { spawn } = require('child_process');
   const child = spawn('node', ['script.js']);

   child.stdout.on('data', (data) => {
     console.log(`stdout: ${data}`);
   });

   child.stderr.on('data', (data) => {
     console.error(`stderr: ${data}`);
   });

   child.on('close', (code) => {
     console.log(`child process exited with code ${code}`);
   });
   ```

2. **使用 Worker Threads**：
   Node.js 的 `worker_threads` 模块允许你创建线程来并行执行代码。每个 Worker 运行在独立的内存空间中，这提供了一定程度的隔离。

   ```javascript
   const { Worker, isMainThread } = require('worker_threads');
   if (isMainThread) {
     const worker = new Worker(__filename);
     worker.on('message', (msg) => console.log(msg));
     worker.on('error', (err) => console.error(err));
     worker.on('exit', (code) =>
       console.log(`Worker stopped with exit code ${code}`),
     );
   } else {
     console.log('Worker running');
   }
   ```

3. **使用 vm 模块**：
   Node.js 的 `vm` 模块允许你以受限的方式运行代码。你可以创建一个上下文，将代码编译为脚本，并在该上下文中运行。

   ```javascript
   const vm = require('vm');
   const sandbox = { console };
   const script = new vm.Script('console.log("Hello, World!")');

   script.runInNewContext(sandbox);
   ```

4. **使用 Docker 容器**：
   将代码运行在 Docker 容器中是创建沙箱环境的另一种方法。容器提供了隔离的运行环境，可以限制代码对宿主系统的访问。

   ```bash
   docker run -it --rm node:latest node /path/to/your_script.js
   ```

5. **使用第三方沙箱服务**：
   有些服务如 Now Secrets, Sandstorm.io 提供了沙箱环境，你可以在这些平台上运行你的 Node.js 代码。

6. **使用 Secure-Context**：
   Node.js 17 引入了 Secure Contexts，这是一种新的安全特性，可以限制 Node.js 应用程序的能力。

   ```javascript
   const { Worker } = require('worker_threads');
   const { createSecureContext } = require('crypto');

   const secureContext = createSecureContext();

   const worker = new Worker(new URL(import.meta.url), {
     eval: false,
     secureContext,
   });
   ```

7. **使用隔离的模块**：
   使用如 `vm2` 这样的第三方模块，它提供了比内置 `vm` 模块更高级的沙箱功能。

   ```javascript
   const VM = require('vm2');
   const vm = new VM();

   vm.run('console.log("Hello, World!")');
   ```

选择哪种方法取决于你的具体需求，例如代码的复杂性、安全性要求、性能考虑以及是否需要与其他系统集成。在设计沙箱环境时，始终要考虑到潜在的安全风险，并采取适当的措施来最小化这些风险。
