//const {worker, isMainThread } = require('worker_threads');


const { Worker, isMainThread, workerData } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: '*Hello, world!', threadid: 123 });
  worker.postMessage ( worker.threadid )
} else {
  console.log("worker thread: " + workerData);  // Prints 'Hello, world!'.
}

