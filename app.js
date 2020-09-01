const fs = require('fs');
const randomInt = require('random-int');

const ganders = ['M', 'F'];
const firstNameMale = ['Max', 'Florian', 'Jack', 'Daniel', 'Sam', 'Bob', 'Tim', 'George', 'Nick'];
const firstNameFemale = ['Agnes', 'Angela', 'Klaudia', 'Izabel', 'Anna', 'Lisa', 'Nat', 'Lee', 'Vicky'];
const lastName = ['King', 'West', 'Moon', 'Rogers', 'Emglish', 'Anderson', 'Willkinson', 'Bond'];
const people = [];

for (let index = 0; index < 20; index++) {

    let gander = Math.floor(Math.random() * ganders.length);
    const chosenGender = ganders[gander];

    let surname = Math.floor(Math.random() * lastName.length);
    let lastname = lastName[surname]
    const age = Math.floor(Math.random() * (78 - 18 + 1) + 18)
    let name = chosenGender === 'F' ? firstNameFemale[Math.floor(Math.random() * firstNameFemale.length)] : firstNameMale[Math.floor(Math.random() * firstNameMale.length)]

    const person = {
        gender: chosenGender,
        name: name,
        surname: lastname,
        age: age,
        email: `${name}.${lastname}@gmail.com`,
        mobile: randomInt(100000000, 1000000000),
    }
    people.push(person)
}

console.log(people)

fs.writeFile('people.json', JSON.stringify(people), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});