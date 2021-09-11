class Person {
   constructor(firstName, lastName, dob){
      this.firstName = firstName;
      this.lastName = lastName;
      this.birthday = new Date(dob);
   }

   greeting(){
      return `Hello there ${this.firstName} ${this.lastName}`;
   }

   calculateAge(){
      const diff = Date.now() - this.birthday.getTime();
      const ageDate = new Date(diff);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
   }
}

const jason = new Person('Jason', 'Bunnell', '09-19-1973');

console.log(jason);