

let pug = require ("pug")


let template_compiler = pug.compileFile ( "view.pug")

console.log ( template_compiler( {name:'eemi'}))