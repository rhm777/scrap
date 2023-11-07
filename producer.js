const { Worker, isMainThread, workerData } = require('worker_threads');
const async = require('async');

// Create a task queue
const taskQueue = async.queue((task, callback) => {
  // Process the task
  /*const worker = new Worker('./worker.js', { workerData: task });
  worker.on('message', (result) => {
    // Handle the result of the task
    console.log(result);
    callback();
  });*/
});

taskQueue.push ( {"key1": "value_1"} )
taskQueue.push ( {"key2": "value_2"} )
taskQueue.push ( {"key3": "value_3"} )
let obj = taskQueue.remove (0)
console.log ( obj )