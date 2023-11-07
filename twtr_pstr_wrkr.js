const { worker_c , worker_impl } = require("./worker_c");

class worker_impl_twtr_pstr extends worker_impl
{
    
      
    async process_message ( message )  // virtual.
    {
        console.log( "--------------->posting to twiter " + message["key_1"]);
        await this.delay ( 10000 )
        console.log ( "-------------->done posting to twitter..." + message["key_2"])
        return message["key_2"]
    }
}

wrkr  =   new worker_c(0 , new worker_impl_twtr_pstr() )
wrkr.run()
