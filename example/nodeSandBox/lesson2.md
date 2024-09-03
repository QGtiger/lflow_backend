设计一个安全的 Node.js 沙箱环境来执行代码需要考虑多个方面，包括代码隔离、异常处理、资源限制、超时策略和外部依赖管理。以下是一个设计方案：

### 1. 代码隔离

使用 `vm` 模块创建隔离的执行环境，确保沙箱中的代码不会访问到宿主环境的全局对象。

```javascript
const vm = require('vm');
const { serialize } = require('v8');

function createSandbox() {
  const sandbox = {
    console,
    // 可以添加更多安全的方法和对象
  };
  return sandbox;
}
```

### 2. 异常处理

在沙箱环境中执行代码时，使用 `try...catch` 语句捕获异常，防止异常影响宿主环境。

```javascript
function runInSandbox(code, sandbox) {
  const script = new vm.Script(code);
  try {
    script.runInNewContext(sandbox);
  } catch (error) {
    console.error('Error in sandbox:', error);
  }
}
```

### 3. 超时策略

为了防止 `while` 死循环和长时间运行的代码，可以设置一个超时策略。这可以通过 `setTimeout` 和 `clearTimeout` 来实现。

```javascript
function runInSandboxWithTimeout(code, sandbox, timeout = 5000) {
  let completed = false;
  const script = new vm.Script(code);
  const timer = setTimeout(() => {
    completed = true;
    throw new Error('Execution timed out');
  }, timeout);

  try {
    const result = script.runInNewContext(sandbox);
    clearTimeout(timer);
    return result;
  } catch (error) {
    if (completed) {
      console.error('Execution timed out');
    } else {
      console.error('Error in sandbox:', error);
    }
  } finally {
    clearTimeout(timer);
  }
}
```

### 4. 资源限制

对于单个 Node.js 执行的资源问题，可以考虑限制内存使用、CPU 时间等。这可以通过 `worker_threads` 或者外部工具如 `cpu-usage` 来监控。

```javascript
const { Worker, isMainThread } = require('worker_threads');
const { cpuUsage, freeMemory } = require('cpu-usage');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { code } });
  worker.on('message', (msg) => console.log(msg));
  worker.on('error', (err) => console.error(err));
  worker.on('exit', (code) =>
    console.log(`Worker stopped with exit code ${code}`),
  );

  const checkResources = () => {
    const usage = cpuUsage();
    const mem = freeMemory();
    if (usage > 0.8 || mem < 50 * 1024 * 1024) {
      // 假设 CPU 使用率超过 80% 或内存少于 50MB 则停止
      worker.terminate();
      console.log('Resources exceeded, worker terminated');
    }
  };

  setInterval(checkResources, 1000); // 每秒检查一次资源使用情况
} else {
  // Worker 代码
}
```

### 5. 外部依赖管控

对于外部依赖包的管理，可以创建一个干净的 `node_modules` 目录，只包含运行代码所需的最小依赖。

```javascript
const { setupWorker } = require('worker_threads');
const path = require('path');
const { createSandbox } = require('./sandbox');

const workerData = { code };
const workerFilename = path.resolve('./worker.js');

setupWorker(
  // worker 代码
  `
  const { workerData, createSandbox } = require(${JSON.stringify(
    workerFilename,
  )});
  const sandbox = createSandbox();
  runInSandbox(workerData.code, sandbox);
  `,
  { workerData },
);
```

在 `worker.js` 中，你可以加载和执行代码，同时控制外部依赖。

### 6. 安全策略

- **限制文件系统访问**：沙箱中的代码不应该有权限访问文件系统，除非是特定的、受控的目录。
- **限制网络访问**：如果代码需要网络访问，应该通过代理或限制特定的端口和协议。
- **定期更新依赖**：确保所有依赖都是最新的，以减少安全漏洞的风险。

### 7. 日志和监控

- **记录所有沙箱活动**：包括执行的代码、执行时间、资源使用情况和任何错误。
- **监控沙箱性能**：使用 Node.js 的性能监控工具，如 `perf_hooks`。

通过上述措施，你可以创建一个相对安全的沙箱环境来执行 Node.js 代码，同时控制和限制潜在的风险。
