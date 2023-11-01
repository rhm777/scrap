//  implement inheritance then use separate file.
var trade_t         =  require ( "trade_t" );
const impl_pltfrm   =  async function ( )
{
    this.symbol_mapping = new Map();


};

impl_pltfrm.prototype.get_symbol                =  async function ( symbol )  // ?
{   // returns platform spefic symbol.

}

impl_pltfrm.prototype.do_init                   =  async function ( trade  )  // *
{

}

impl_pltfrm.prototype.create_symbol_mapping     =  async function ( from_symbol_list )  // *
{

}

impl_pltfrm.prototype.open_trade  =  async function ( trade )                // *
{

}

impl_pltfrm.prototype.close_trade =  async function ( trade )                // *      
{

}


