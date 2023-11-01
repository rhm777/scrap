


function Person ( fname , lname, age )
{
    this.fname = fname
    this.lname = lname
    this.age   = age
}
Person.prototype.greet  = function ( )
{
    console.log ( "age is " + this.age )
}
Person.prototype.show_1  = function ( )
{
    console.log ( this.fname + " , " + this.lname )
}
function Student ( fname , lname , age , education , major )
{
    Person.call ( this , fname , lname, age )
    this.education  =  education 
    this.major      =  major
}
Object.setPrototypeOf ( Student.prototype , Person.prototype )
Student.prototype.show  = function ( )
{
    //Person.prototype.show.call ( this )
    this.show_1()
    console.log ( this.education + " --- " + this.major )
    
    this.greet()
}
let std = new Student ( "r", "h",30, "metric", "maths")
std.show()
//std.greet()