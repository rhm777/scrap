


function Person ( fname , lname , age )
{

    this.fname = fname
    this.lname = lname
    this.age   = age
}
Person.prototype.show  = function ( )
{
    console.log ( " Name: " + this.lname + ", " + this.fname + ", age: " + this.age + "")
}

function Student ( fname ,lname , age ,  education, major  )
{
    Person.call ( this , fname,lname , age )   // person will use this as current object.
    this.education = education
    this.major     = major
}
Student.prototype.show_ = function ( )
{
    console.log ( "student")
    this.prototype.show()
    console.log ( " education:" + this.education + " -- major: " + this.major )
}
Student.prototype = new Person()
Student.prototype.constructor = Student
let std = new Student ( 'r', 'b', 30 , 'metric' ,'science')
std.show()






