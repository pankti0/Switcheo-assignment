
// For loop implementation
// ASSUMPTION: Sums negative numbers from n to 0 ex sum_to_n_a(-5) = 0-1-2-3-4-5 = -15 
var sum_to_n_a = function(n) {
    if (n < 0){
    n = n * -1;
    var total = 0;
    for (var i = 1; i < n+1; i++){
        total += i;
    }
    return total*-1;   }
    else{
        var total = 0;
        for (var i = 1; i < n+1; i++){
            total += i;
        }
        return total;}
};
//Time complexity: O(n) - loop runs n times
//Space complexity: O(1) - constant amount of space used

//While loop implementation
// ASSUMPTION: Sums negative numbers from n to 0 ex sum_to_n_a(-5) = 0-1-2-3-4-5 = -15 
var sum_to_n_b = function(n) {
    if (n < 0){
        n = n * -1;
        var i = n+1;
        var total = 0;
        while(i--){
            total += i;
        }
        return total * -1;}
        else{
            n = n * -1;
        var i = n+1;
        var total = 0;
        while(i--){
            total += i;
        }
        return total;
        }
};
//Time complexity: O(n) - loop runs n times
//Space complexity: O(1) - constant amount of space used

//Recursive implementation
//ASSUMPTION: In this implementation we do not accept negative n values and just return 0
var sum_to_n_c = function(n) {
    if (n <= 0) {
        return 0;
    }
    return n + sum_to_n_c(n-1)
};
//Time complexity: O(n) - loop runs n times
//Space complexity: O(n) - n recursive calls shall add n new frames to stack

//Test logs
console.log(sum_to_n_a(-5));
console.log(sum_to_n_b(-5));
console.log(sum_to_n_c(-5));