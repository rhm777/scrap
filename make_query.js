
// 7 days:1400  default.  50 * 7=350 milk. bread/cereal(500) ... corncereal(300)...1100
// 100*7 days  breakfast = 700-->2100.
// 1400 for 7 meals: 1400.  --> 5000 perweek.
// daily  50 milk ---> break 25 cereal 10   ... 75...  80*7 = 420.
// food 14 treats:  8 + 4*150 + 2*200 = 1000 ... 1500.

// first take string with space etc and generate array entry parse_class.
// add eol to entry.
// operand stack    obj_stack.
let clb  = require ("./common_lib")
let scanner = require ("./scanner")

// ( {} , or , {} )-->{"$or":[{"symbol":"gbpusd"},{"symbol":"eurusd"}]}
function  make_query (   str  )
{
    this.str             =  str
    this.query_str       =  ""
    this.query_str_obj   =  undefined
}
// following makes operand or  = , < , <= , > , >=
make_query.prototype.make_operand = function (  operand_1 , operator ,operand_2 )
{       // return a string as require.e.g.  {\"$operator\":[operand_1,operand_2]}
    let ret_str = ""
    // logical operator only.
    let operator_map =  {"<":"$lt","<=":"$lte",">":"$gt",">=":"$gte","==":"$eq"}
    if ( operator == "=" )
    {
        if ( clb.isAlphaNumeric(operand_2) )
            operand_2 = `"${operand_2}"`
        ret_str = `{"${operand_1}" : ${operand_2}}`
    }       
    else {
        let operator_str = operator_map[operator]
        if ( clb.isAlphaNumeric(operand_2) )
            operand_2 = `"${operand_2}"`
        ret_str = `{"${operand_1}" :{ "${operator_str}" :${operand_2}} }`
    }
    return ret_str
}

make_query.prototype.make_operand_w_arr   =   function  ( operand_arr , operator )
{   // returns json_string_type ... 
    // {"$OR|$AND":[{},{},{}]} or {"$OR|$AND":{}} if array size is one   
    //console.log ( operator )
    let log_oper = { "&&":"$and", "||":"$or" }
    operator = log_oper[operator]
    let ret_str = `{"${operator}":`
      if ( operand_arr.length > 1 ) {
        ret_str = ret_str + "["
        for ( i = 0; i < operand_arr.length; i++ )
        {
            if ( i != operand_arr.length - 1 ) 
                ret_str = ret_str + operand_arr[i] + ","
            else
                ret_str = ret_str + operand_arr[i] + ""
        } 
        ret_str = ret_str + "]"
      }
      else if (operand_arr.length == 1 ) {
            ret_str = ret_str + operand_arr[0]
      }
    ret_str = ret_str + "}"
    //console.log ( ret_str )
    return ret_str 
}

// then pop two operands and the operator. take actions as follows:
//                           if operator =  =/rel_op(any)   make_operand and push it.
//                           if operator =  && || then pop all operands. and push makeoperandwarr.
// while token is eol
//      if token.match ( "(")  push on stack.
//      if token.match ("oparator") push it on operator.stack.
//      if token.match ( "variable" )  and operator stack is empty. push it on operand.stack.
//      else if operator stack is not empty....  // this take care of assignment.
//          pop operator.
//          if operator in =, anyrelation_operator
//               pop pop pop opertaror  push.operator_stack( make_operand() )
//      else if token.match (")")    // close bracket    
//               while ( (op = stack.pop) -->isEmpty() ||  "(" )
//                      [] = operator.
//               pop operand.  push make_operand_arr // if [].size==1 don't make [] in string.
//
// return operand.pop()  // which is a final string.
// a || b|| c && d will not work. use following:
//     ( a||b||c) && (d) or (a||b)||(c&&d)

make_query.prototype.parse  =   function ( )
{
    // if parsed version is not expired...
    let scanner_     =   new scanner ( this.str ) 
    
    let token = ""
    let operator_stack = [];  let operand_stack = []
    while ( (token = scanner_.next_token ()) != "EOL" )
    {
        //.log ( token )
        if ( token.match_type("OPN_BRACKET") )
             operand_stack.push (token)
        else if ( token.match_category ( "OPERAND" ) )
        {   //console.log ( "FIELD: " + token.val )  
            operand_stack.push ( token )
            if ( operator_stack.length > 0 )
            {
               // console.log ( "creating new operand....for ")
                let operator = operator_stack.pop()
               // console.log ( "---------['" + operator.val + "']")
                if ( operator.match_category ("REL_OP") ){
                    let operand_1 = operand_stack.pop()
                    let operand_2 = operand_stack.pop()
                    let new_operand = this.make_operand(operand_2.val, operator.val, operand_1.val )
                   // console.log ( new_operand)
                    operand_stack.push ( new_operand )
                }
                else { operator_stack.push ( operator ) }
            }    
        }
        else if ( token.match_category ("REL_OP") )
        {
            //console.log ( "---->operator: " + token.val )
            operator_stack.push ( token )
        }
        else if ( token.match_category ("LOG_OP") )
        {
            //console.log ( "---->operator: " + token.val )
            operator_stack.push ( token )
        }
        else if ( token.match_type ("CLS_BRACKET")  )
        {
            //console.log ( "******************************operator: [" + token.val )
            let  tmp_token = ""; let tmp_arr = [];
            while ( operand_stack.length > 0  )
            {
                tmp_token = operand_stack.pop()
                if ( tmp_token.val == "("  )
                    break
                tmp_arr.unshift ( tmp_token )
                
            } 
            let log_operator = ""
            for ( let a = 0; a < tmp_arr.length-1; a++ )
               log_operator = operator_stack.pop()
            //console.log ( log_operator )
            //console.log ( tmp_arr )
            operand_stack.push ( this.make_operand_w_arr (tmp_arr, log_operator.val ) ) 
        }
        else if (  token.match_type ("EOL") )
        {
            //console.log ( "******************************operator: [" + token.val )
            // here pop into the array all operands. not till ('
            let temp_arr = []
            if ( operator_stack.length > 0 )
            {
                while ( operand_stack.length > 0 )
                {
                    temp_arr.unshift ( operand_stack.pop())
                }
                let log_operator = operator_stack.pop()
               // console.log ( log_operator )
               // console.log ( temp_arr )
                operand_stack.push ( this.make_operand_w_arr (temp_arr, log_operator.val ) ) 
            }
            break
        }
    }
   // console.log ( "finished parsing...." )
   // while ( operator_stack.length > 0 )
   //     console.log ( operator_stack.pop() )
    //while ( operator_stack.length > 0 )
   // if ( operand_stack.length > 0 ){
        this.query_str =  operand_stack.pop()
        if ( this.query_str  )
            this.query_str.trim()
   // }
  //  if ( this.display_fields != "" )
  //      this.query_str  +=  "," + this.display_fields
    
    //console.log ( this.query_str )
}

make_query.prototype.add_display_fields = function ( str )
{
    this.display_fields = str
}
make_query.prototype.add_sort_fields = function ( str )
{
    this.sort_fields    =  str 
}
module.exports = make_query

//let expr_str =  "(symbol=eurusd && close_price <= 40.0) || ( (symbol=usdjpy || symbol=gbpusd) && open_price <= 40.0)) "
// && open_price < 18.0"// || open_price<=100.25" // || open_price >= 1.307"
//let scanner_ = new scanner ( expr_str )
/*
let tok = ""
while ( (tok =scanner_.next_token()) != 'EOL')
    console.log ( tok )
*/
//let mq = new make_query ( scanner_ )
//mq.add_sort_fields (  {symbol:-1,close_price:1, opend_price:1})
//mq.add_display_fields ( "{_id:false , __v:false, symbol: true , close_price: true , open_price:true}")
//mq.parse()















// e.g. queries:
// symbol = eurusd    ... 1 
// symbol = gbpusd or symbol = eurusd  .... 2
// symbol = gbpusd or symbol = eurusd and ( close_price <= 1.377 ) ... 3
// symbol = gbpusd or symbol = eurusd and close_price <= 1.377 ) ... 4
// 1:   push symbol , push =  push eurusd reading coming operator
        // if not then pop operator pop eurusd pop symbol
        // make operand ... symbol operator eurusd
        // push operand.
        // if eol break.
        // return pop operand.
// 2:
// 3:
// complex queries:
//let expr_str =  "(symbol >= eurusd) && close_price== 1.3701 || open_price >= 1.307"


// symbol=eurusd && close_price >= 3.7
// symbol:eurusd  push(make_operand())
// push and
// close_price >= 3.7  push(make_operand())
//  while ( stack.pop is not a stopping condition...) i.e. empty ( or other_operator.
//       add_to_arr [ stack.pop ]
//  make operand_w_arr ( arr , operator )
// symbol=eurusd || close_price >= 3.7  // same as above.   .... A
// symbol=eurusd && close_price >= 3.7 && open_price > 3.0
// symbol=eurusd || close_price >= 3.7 || open_price > 3.0  
// symbol=eurusd || close_price >= 3.7 && open_price > 3.0  
// symbol=eurusd && close_price >= 3.7 || open_price > 3.0  
// any brackets should work.
// e.g. complex query.



// { }   .... A.  or   symbol = "eurusd"  , close_price = 1.372
// array  =   one  parse_class.
// { } or {}  ---> arr---> 3 parse class array.
// ( {} or {} )   ---> arr---> 5 parse class array.  
// OPN_BRAC OBJ_OPN_BRAC OPN_BRAC OP_OR OP_AND
// algo practise:
//     A.
//     if obj  push on operand stack.
//     if EOL  pop from operand stack.    

//     B.
//     let item of all items.
//         if item is operand and there is not item on the operand stack.
//             push on operand stack.
//         if item is operand and there is a item on the stack.
//             pop item pop operatorm,  push make_operand ( )
//         else if item is operator push on operator stack.
//         
/*
let mq = new make_query()
let op_1 = mq.make_operand ( "symbol","=","eurusd" )
let op_2 = mq.make_operand ( "close_price", "<=", "1.371" )
let op_3 = mq.make_operand ( "close_price", "=" , "4.3" )
console.log ( op_1 )
console.log ( op_2 )
console.log ( op_3 )
*/



// more complex examples.
/*
let vr = "str"
let no = 73243
let vr_1 = "s3243"
let vr_2 = 7
console.log ( typeof vr == "string" )
console.log ( typeof no )
console.log ( typeof vr_1 == "number")
console.log ( typeof vr_2 == "number" )
*/
 

