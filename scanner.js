

function token  ( type , category , val )
{   // if str == ... using switch.
    this.type        =   type
    this.category    =   category 
    this.val         =    val
}

token.prototype.match_type =  function ( type )
{
    return ( this.type == type )
}
token.prototype.match_category =  function ( category )
{
    return  ( this.category == category )
}

token.prototype.print =  function ( )
{
    console.log ( "[token.print] string: " + this.str )
}

// how should the scanner implemented.
// skip white space.
function scanner ( str )   // returns token.
{   // for series of characters create a token.
    this.str  =   str  + "\n"
   // console.log ( this.str )
    this.pos = 0
}
scanner.prototype.get_character = function ( pos )
{
    return this.str.charAt ( pos )
}
// returns a string presentation of valid token.
// e.g. symbol   =   eurusd  && close_price <=1.370 and ==.
// here operator is readed differently  , compared to
// symbol , close_price.
scanner.prototype.next_token = function ( )
{
    let ch = 0 ;  //let pos = 0;
    let operator_list = { "=":true , "(":true , ")":true , "&":true, "|":true , "<":true, "<=":true,">":true,">=":true,"==":true}
    while ( (ch = this.get_character(this.pos)) != '\n') 
    {
    
        if ( ch == ' ')      // skip whitespace.
        {  this.pos++; continue }
        //console.log ( this.pos + " --- " + ch )
        // if first charater in operator_list then read as operator.
        // term character is space,equalsign.
        let ret_token = ""
        if ( operator_list[ch] ){ // relation operator. && || > >= < <=
            ret_token = ch
            let next_char = this.get_character((this.pos+1)) // read another character.
            this.pos++;    
            if ( ch == "(" )
                return new token ( "OPN_BRACKET", "BRACKET", ch )
            else if ( ch == ")")
                return new token ("CLS_BRACKET" , "BRACKET", ch )                      
            else if ( ch == "&"  && next_char == "&")  // next character also matched.
            {
                ret_token = ret_token + next_char
                this.pos++           
                return new token ( "LOG_AND", "LOG_OP", ret_token )
            }
            else if ( ch == "|"  && next_char == "|")  // next character also matched.
            {
                ret_token = ret_token + next_char
                this.pos++           
                return new token ( "LOG_OR" , "LOG_OP", ret_token )
            }
            else if ( ch == "="  && next_char == "=")  // next character also matched.
            {
                ret_token = ret_token + next_char
                this.pos++           
                return new token ( "REL_EQ" , "REL_OP" , ret_token )
            }
            else if ( (ch == "<" || ch == ">" ) && next_char == "=") // next.chalsomatched.
            {
                ret_token = ret_token + next_char
                this.pos++
                if ( ch == "<") return new token ( "REL_LESS_THAN_EQ" , "REL_OP", ret_token )
                if ( ch == ">") return new token ( "REL_GREATER_THAN_EQ" , "REL_OP", ret_token )
                return ret_token
            }
            else   // token is either < > = 
            {
                if ( ch == "<") return new token ( "REL_LESS_THAN" , "REL_OP", ret_token )
                else if ( ch == ">") return new token ( "REL_GREATER_THAN" , "REL_OP", ret_token )
                else if ( ch == "=") return new token ( "REL_GREATER_THAN" , "REL_OP", ret_token )
                else{
                    console.log ( ch + "--" + next_char)
                    return false    // error. either & | .
                }    
            }
        }
        else{   // field or values.
             this.pos++
             ret_token = ch
        
             while ( next_char = this.get_character(this.pos) )   
             {   if ( operator_list[next_char] || next_char == '\n' )
                 {
                    if ( next_char == ' ' ) this.pos++
                    return new token ( "FIELD", "OPERAND" , ret_token.trim() )
                 }
                 ret_token = ret_token + next_char 
                 this.pos++
             }
        }   
    }
    return new token ("EOL","EOL","eol")
}

scanner.prototype.read_token = function (  from,str )
{
    let token = ""
    console.log ( str.charAt(from) )
    //console.log ( str.chartAt(++from) )
    
    return [from,token]
}

scanner.prototype.peek_token  = function ( )
{

}
//let expr_str =  "(symbol >= eurusd) && close_price== 1.3701 || open_price >= 1.307"

//let expr_str =  "symbol = eurusd" //; && close_price== 1.3701 || open_price >= 1.307"
//let scanner_ = new scanner ( expr_str )
module.exports = scanner