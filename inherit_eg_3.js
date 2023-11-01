// Initialize constructor functions
function Hero(name, level) {
    this.name = name;
    this.level = level;
  }
  
  function Warrior(name, level, weapon) {
    Hero.call(this, name, level);
  
    this.weapon = weapon;
  }
  
  function Healer(name, level, spell) {
    Hero.call(this, name, level);
    this.base  = this.__proto__.__proto__
    this.spell = spell;
  }
  
  // Link prototypes and add prototype methods
  Object.setPrototypeOf(Warrior.prototype, Hero.prototype);
  Object.setPrototypeOf(Healer.prototype, Hero.prototype);
  
  Hero.prototype.greet = function () {
    console.log (  `base ... ${this.name} says hello.` )
  }
  
  Warrior.prototype.greet = function ()
  {
      
      console.log ( `overriden .... ${this.name} says hello.`)
  }
  Warrior.prototype.attack = function () {
    Hero.prototype.greet.call(this)  
    console.log ( `${this.name} attacks with the ${this.weapon}.`)
  }
  
  Healer.prototype.heal = function () {
    return `${this.name} casts ${this.spell}.`;
  }
  
  // Initialize individual character instances
  const hero1 = new Warrior('Bjorn', 1, 'axe');
  //const hero2 = new Healer('Kanin', 1, 'cure');
  hero1.greet() 
  hero1.attack()

