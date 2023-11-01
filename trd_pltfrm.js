
// has networking: received    trd_opn_req_str.
// logs it.
// converts to trade_obj.
// calls impl_pltfrm.open_trade ( trade ) 
// if success open. then logs to trade_open_success.  
// if failed. then   logs  to    trade_close_success.    




const trd_plffrm    =   async function  ( impl_pltfrm )  //e.g. olymp_trade. instance.
{



};

trd_plffrm.prototype.process_open    =    async function ()
{

}

trd_plffrm.prototype.process_closed    =    async function ()  // thread is needed. B.
{

}

trd_plffrm.prototype.run    =    async function ()             // thread is needed. A.
{

}

// note that timeout can be used also, along with networing.
// A and B should be mutually exclusive, since tabs may switched.
// or check if data can be readed without switching or actions can be done without
// switching e.g. first link of each page. of certain class. file: check_tab_switching.


