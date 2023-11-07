//const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const { queue_worker }  = require("./queue_worker_singleton.js")

let q_w = new queue_worker()
q_w.run()

