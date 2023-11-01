/*  today: may 10, 2022.
        plffrm: network received data.
                added to the queued consumer, so that network is available immediately.
                queued consumer is local. calls eventlistener which are
                opt_pltfrm ... which added it to the local queue 
                and worked one by one.
                it has setinterval also.
                opt_dispatcher ... forwards to all opt_pltfrm.
                one etc queue is used. 

        opt_impl is array.    
        add opt_impl from outside. 
        each opt_pltf has one impl. where setInterval is configured from outside.
        each opt_pltf provide inherited trade_list.
        take start based on above.
        read inheritance.
        implement trade_lst_w_closed_queue.
        practise with sort when trade is returned from ui. for closed.
        check_for_closing is runned by set interval. runs every five seconds.
        passes last trade_id and calls only if there are active trades,
        implementation returns with new trades till id. it returns
        the trade_obj. and readed from last to first. using pop.
        opt_pltfrm is listener to pltfrm and does perf_report.
        it concurrent_4.js.
        trade.unique_id  =  open_time , close_time , open_prc , cls_prc.
        trade.distance   =  abs(opn_tm) + abs(cls_tm) , open_prc-oth.open_prc is equal
                            then 0 else cls_prc - ... 0.
                            sort by least.
        trade.local_open_data(actual date)  trade.local_close_date ( close_date)
        therefore start with opt_pltfrm.js
            check the local date or gmt date matches to that of pltrm.
            fixed trade_t with requirement above.
            implement trade_lst_w_queue with sorting check.
            sort_interval --- check_for_closing... returns.
            network call would not return.
            calling open_trade   is_trade_closed() using async mutex for impl.
*/

const olymp_opt_impl  =   require ( "./olymp_opt_impl");
const trade_t  =    require ("./trade_t");

let r = async function ( )
{

let trade  = new trade_t ( );
trade.set_symbol   ( "gbp/usd")
trade.set_amount   (  8  );
trade.set_duration (  0 , 2 );
trade.set_dir      (  1 );
console.log ( trade );
console.log( trade.get_dir_str() + " ---  "  + trade.get_amount() + " -- ");
console.log ( trade.get_duration() )
console.log ( trade.get_duration_str() )
let opt_ins = new olymp_opt_impl();
await opt_ins.initialize ( );
//await opt_ins.open_tab_for_asset ( opt_ins.page , "asia")
//await opt_ins.page.bringToFront();




//await opt_ins.switch_symbol ( opt_ins.page , "europ")

//await opt_ins.close_trades_panel();
//await opt_ins.read_close_trades();

// todo:  
// fix close all panels if visible ??? i.e. clear using visible etc. use setTimeout waittmout.
// to proceed further following is needed in one or two days: 9th may.
// date api complete reference for: add, format , local etc.
// promise wait consumer / producer generalize.
// e.g. would be some object is produced and some object will be consumed or notified.
// e.g. require (consumer_producer);
//      instance.    instance.produce(obj)    instance.consumer() a loop.
// note: consumer will be a opt_impl which acquires ui_entry_mutex.
//       agains, close_trade collector.
//       to avoid locking use another browser instance.
//       but consumer producer will be needed as follows:
//       network_client  acquires data, produces it to the opt_pltform running 
//       multiple instances or single instance.
//       and return. all instances given a call back routine which does the reporting in
//       option sense.



//await opt_ins.open_trade ( trade );

// after trade opening read a identifier, which will be used in 
// closed_list. also,
// read all closed trade_list. tomorrow.

// use macro to practise first.
// open list is not available.



// change duration , amount , symbol, open buy , open sell.
    //await opt_ins.set_trade_amount ( 17 );            *
    //await opt_ins.set_trade_symbol ( "gbp/usd");
    //await opt_ins.set_trade_duration ( "1", "7" );    *
    //await opt_ins.open_buy_trade ( );                 *
    //await opt_ins.open_sell_trade ( );                *
    
}
r();