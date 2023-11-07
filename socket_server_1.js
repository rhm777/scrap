//  todo now:
//  fixed client to use modules.
//  send objects.
//  send objects from python.
//  integrate twtr_pstr_0.
//  transfer codes to other computer using backup.

const net = require("net");
const { inherits } = require("util");
const port = 3001;
class socket_server
{
    constructor ( host , port , backlog , sock_conn )
    {
        this.host            =  host
        this.port            =  port 
        this.backlog         =  backlog
        this.sock_conn       =  sock_conn
        this.socket_map      =  new Map()
    }

    // use the socket instead of client address.
    get_connection_from_socket ( socket )
    {   // given original socket return the sock_conn from map.
        let client_addr = `${socket.remoteAddress}:${socket.remotePort}`
        return this.socket_map.get ( client_addr )
    }

    get_socket_connection ( socket_conn )  // this function is not needed.
    {   // here  input is actual socket
        return this.socket_map.get ( socket_conn.get_client_address_str() )
    }

    add_socket_connection ( socket_conn )  // here input is socket_conn.
    {
        this.socket_map.set ( socket_conn.get_client_address_str(), socket_conn )
    }

    remove_socket_connection ( socket_conn ) // here input is socket_conn.
    {
        this.socket_map.delete ( socket_conn.get_client_address_str()  )
    }
    get_connection_count ( )
    {
        return this.socket_map.size
    }
    broadcast_message ( msg )
    {
        for ( let [ key , sock_conn ] of this.socket_map )
        {
            console.log ( "\r\n\r\n[server] for connection:", key  , " --- sending message:" + msg )
            sock_conn.send_msg ( msg )
        }
    }
    print ( )
    {
        console.log ("[server] no of connections:" + this.get_connection_count() )
    }
    start (  )
    {
        this.server = net.createServer ( );
        this.server.listen ( this.port , this.host , this.backlog , ()=>
        {   
            console.log ( `socket_server listenting on ${this.host}---${this.port}`)
        } ); 
        var client_addr = "no info"      
        
        this.server.on ( 'connection', (socket)=>{
            //sock_conn   =  new socket_connection ( socket )
            sock_conn     =  this.sock_conn.get_instance(socket)
            this.add_socket_connection ( sock_conn )
            console.log ( ` new client at ${sock_conn.get_client_address_str()}`)
            this.print()
            //console.log ( " map-length: ", this.socket_map.size )
            sock_conn.send_msg ( "[initial_message] [server]welcome --- " + sock_conn.get_client_address_str() )
            socket.on ( 'data' , ( data ) => {
                let client_conn  =  this.get_connection_from_socket ( socket )
                client_addr  =  client_conn.get_client_address_str()
                client_conn.on_data ( data )
            });

                
            socket.on ( 'close' , ( data ) => { 
                let client_conn  =  this.get_connection_from_socket ( socket )
                client_addr  =  client_conn.get_client_address_str()
                // broadcast message if required. or defined or needed.
                client_conn.on_close ( )
                this.remove_socket_connection ( client_conn )
                this.broadcast_message ("[sever] - sock disconnected:" + client_addr )
                
                //this.print()
            }); 
            // Add a 'error' event handler to this instance of socket 
            socket.on('error', (err) => { 
                console.log(`Error occurred in ${clientAddress}: ${err.message}`); 
            });     
            
        });
        
    }
};

class socket_connection
{
    constructor ( socket )
    {
        this.socket = socket 
    }
    
    get_client_address_str ( )
    {
        let client_addr = `${this.socket.remoteAddress}:${this.socket.remotePort}`
        return client_addr    
    }

    on_data ( data )
    {
        //console.log ( "[socket_handler]: data received: " , String(data)  )
        //this.socket.write ( "[server] you sended: " + String(data))
    }

    on_close (  )
    {
        //console.log ( "[socket_handler]: connection close. " + this.get_client_address_str() )
    }

    send_msg ( msg )
    {
        //console.log ( "[socket_handler]: sending message: " + msg )
        this.socket.write ( msg )
    }

    extract_seq_str ( str )
    {
        if ( str === undefined )
            return ""
        let p   = str.indexOf("[")
        let q   = str.indexOf("]")
        let s   = str.substring(p+1,q)
        return s;    
    }
    get_object_from_str ( str )
    {
        let s   =  str.replace ("[object]","").trim()
        let obj = JSON.parse ( s )
        return obj;
    }
}

module.exports =  { socket_server,socket_connection }

//sock_conn  =  new socket_connection()
//let s_s    =  new socket_server ( "localhost", 3001, 100 , sock_conn )

//on_data_handler = sock_handler.on_data.bind(socket_handler)
//s_s.start( )

//n  =  new socket_handler()
//n.on_data("rhm")
/*
const server    =   net.createServer ( (socket) => {
    console.log("Client connected");
    socket.on("data", (data) => {
        const strData = data.toString();
        console.log(`Received: ${strData}`);
        const command = strData.split(" ");
        console.log ( command )
        const operator = command[1];
        const operand1 = parseFloat(command[0]);
        const operand2 = parseFloat(command[2]);
        console.log( operator , operand1, operand2)
        let result;
        switch (operator) {
            case "+":
                result = operand1 + operand2;
                break;
            case "sub":
                result = operand1 - operand2;
                break;
        }
        socket.write(result.toString());    
        }
    );

socket.on("end", () => {
    console.log("Client disconnected");
});

socket.on("error", (error) => {
    console.log(`Socket Error: ${error.message}`);
});
});

server.on("error", (error) => {
console.log(`Server Error: ${error.message}`);
});

server.listen(port,"127.0.0.1", () => {
console.log(`TCP socket server is running on port: ${port}`);
});
*/