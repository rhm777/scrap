// todays task.
/* 
    create twtr_pstr_task  which uses task_impl from file: queue_worker.js.
    create class worker_task.  which is defined in worker_2 class. in file queue_worker.
    create class queue_work in queuer_worker.js.
*/

const { worker_thread_singleton , worker_thread_handler }  = require("./queue_worker_singleton.js")

// then move it to different file the class_def.
// and then import it and provide implementations.
class worker_thread_handler_twtr_pstr extends worker_thread_handler 
{
    static get_instance ( )
    {
        return new worker_thread_handler_twtr_pstr()
    }
    async process_queue_item ( obj )
    {
        console.log ( "^^^^^^^^^^^^^[in item processing]processing queue item...[twtr pstr]: " + JSON.stringify(obj) );
        //require("fs").writeFile()
        await this.delay ( 10000 )
        console.log ( "^^^^^^^^^^^^^[done in item processing]processing queue item...[twtr pstr]: " + JSON.stringify(obj) );
       
    }
}
new worker_thread_singleton ( worker_thread_handler_twtr_pstr ).run()
