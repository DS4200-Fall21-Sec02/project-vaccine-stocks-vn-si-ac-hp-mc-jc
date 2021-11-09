// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  d3.csv('vaccine-stocks.csv').then(function(data) {
    console.log(data)
  });

  console.log('Hello, world!');

})());
