

function Proto()
{
    this.name = 'Proto'
    return this
}

Proto.prototype.get_name = function ( )
{
    return this.name
}
class AnyClass extends Proto
{
    constructor (  )
    {
        super ( )
        this.name = "AnyClass"
    }
}
const ins  = new AnyClass()
console.log(ins.get_name())
Proto.prototype.get_name  = function  ()
{
    return "Overriden in prototype"
}
console.log(ins.get_name())
AnyClass.prototype.get_name = function() {
    return "Overriden in Anyclass"
}
console.log(ins.get_name())
ins.get_name  = function  ()
{
    return "Overriden in instance"
}
console.log(ins.get_name())

// Object.setPrototypeOf.
// Object.assign ()

let colors = { color:"black" }
let wheels = { wheel_count: 4 }
const Car = () => {
    return Object.assign({},wheels, colors ) 
}
//let car = Car()
//console.log(car.color)

let cr = { name:"bmw" , power :"2000hp" }
let wheel = { wheels:3}
Object.setPrototypeOf ( cr , wheel )
console.log ( cr.wheels )
console.log ( cr.__proto__ )

