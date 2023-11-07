//const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const { queue_worker_singleton }  = require("./queue_worker_singleton.js")

let q_w = new queue_worker_singleton ( "./twtr_pstr_worker_thread_handler.js")
q_w.run()

