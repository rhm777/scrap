

import socket
import json
host = "127.0.0.1"
port = 3001

client_socket = socket.socket()
client_socket.connect ( (host , port) )

data = client_socket.recv(4096).decode()
print ( "data_recvd(initial)" + data )
obj =  {}
obj["title"]   = "this is a test title_1..."
obj["content"] = "this is a test content_1..."
ob  = {}   
ob["message"]  = obj 

message = "[post_tweet]" + json.dumps(ob)
#message = input ( "--->" )

#while message.lower.strip() != 'bye':
client_socket.send ( message.encode() )
data = client_socket.recv(4096).decode()

print ( "recvd: from server: " + data )
##    message = input ( "---->")
client_socket.close()
##if __name__ == '__main__':

