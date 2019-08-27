class Person {
    constructor(fullName, favColor) {
        this.name = fullName;
        this.color = favColor;
    }
    greet() {
        console.log("Hi there My name is " + this.name + " and my favourite color is " + this.color);
    }
};

export default Person;