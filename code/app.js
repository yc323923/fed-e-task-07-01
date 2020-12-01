//#### 简答题

//### 一、谈谈你是如何理解 JS 异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？
   //JS 因为dom的原因只能是单线程同步解析的一门语言，它的异步只是利用了webapi模拟出来的，它永远只有一条线程去解析
   //event loop 事件循环机制，在代码运行时，先走同步代码，遇到异步的会将其放入队列中，直到同步任务完全执行完，再去看队列里的其他任务，一直循环直到任务队列清空
   //宏任务：整个script settimeout setinterval
   //微任务：promise process.nextTick,observe

   

//### 一、将下面异步代码使用 Promise 的方式改进

// setTimeout(function() {
//     var a = 'hello'
//     setTimeout(function() {
//         var b = 'lagou'
//         setTimeout(function() {
//             var c = 'I ❤️ U'
//             console.log(a + b + c)
//         }, 10);
//     }, 10);
// }, 10);
//参考代码

// Promise.resolve("hello").then(function(a){
//     let b = "lagou";
//     return a + " " + b;
// }).then(function(c){
//     console.log(c +" I ❤️ U");
// })



//### 二、基于以下代码完成下面的四个练习


const fp = require('lodash/fp')
// 数据：horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 185000, in_stock: true },
    { name: 'Pagani Huayra', horsepower: 700, dollar_value: 130000, in_stock: false }
]


//#### 练习1：使用组合函数 fp.flowRight() 重新实现下面这个函数


let isLastInStock = function (cars) {
    // 获取最后一条数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的 in_stock 属性值
    return fp.prop('in_stock', last_car)
}

//> 先定义获取最后一条数据的函数，再定义获取某个对象中的 in_stock 属性的函数，再用 fp.flowRight 组合函数

// function getLast (array){
//     return fp.last(array);
// }

// function getInStock(obj){
//     return fp.prop("in_stock",obj);
// }

// let getValue = fp.flowRight(getInStock,getLast);
// console.log("输出结果",getValue(cars));

//#### 练习2：使用 fp.flowRight()、fp.prop() 和 fp.first() 获取第一个 car 的 name

//> 先定义获取第一条数据的函数，再定义获取某个对象中的 name 属性的函数，再用 fp.flowRight 组合函数

// function getFirst(array){
//     return fp.first(array);
// }

// function getName(obj){
//     return fp.prop("name",obj);
// }

// let getResult = fp.flowRight(getName,getFirst);
// console.log("输出结果",getResult(cars));//输出结果 Ferrari FF

//#### 练习3：使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现

let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}


//> 先定义获取某个对象中的 dollar_value 属性的函数，将该函数作为 fp.map 的数组元素处理函数，再用 fp.flowRight 组合函数

// function getDolarValue(obj){
//     return fp.prop("dollar_value",obj);
// }

// function dealData(cars){
//     return fp.map(getDolarValue,cars);
// }

// let averageDollarValue = fp.flowRight(_average,dealData);

// console.log(averageDollarValue(cars));//318200



//#### 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连续的小写字符串，把数组中的 name 转换为这种形式，例如：sanitizeNames(["Hello World"]) => ["hello_world"]


let _underscore = fp.replace(/\W+/g, '_') // 无须改动，并在 sanitizeNames 中使用它


//> 先定义获取某个对象中的 name 属性的函数，再定义转化为小写的函数，再将空格和下划线替换，,再用 fp.flowRight 组合函数

// function getName(obj){
//     return fp.prop("name",obj);
// }
// function converterToLower(value){
//     return fp.toLower(value)
// }

// let sanitizeNames = fp.flowRight(_underscore,converterToLower,getName);
// console.log(sanitizeNames(fp.first(cars)));


//### 三、基于下面提供的代码，完成后续的四个练习


// support.js
class Container {
    static of(value) {
        return new Container(value)
    }
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of(x) {
        return new Maybe(x)
    }
    isNothing() {
        return this._value === null || this._value === undefined
    }
    constructor(x) {
        this._value = x
    }
    map(fn) {
        return this.isNothing() ? this : Maybe.of(fn(this._value))
    }
}


//#### 练习1：使用 fp.add(x, y) 和 fp.map(f,x) 创建一个能让 functor 里的值增加的函数 ex1



// let maybe = Maybe.of([5,6,1]);
// let ex1 = (value) => {
//     console.log(fp.map(function(value){return fp.add(value,1)},value))
// }
// maybe.map(ex1)



//> 函子对象的 map 方法可以运行一个函数对值进行处理，函数的参数为传入 of 方法的参数；接着对传入的整个数组进行遍历，并对每一项执行 fp.add 方法





//#### 练习2：实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素


// let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
// let ex2 = (value) => {
//     return fp.first(value);
// }
// console.log(xs.map(ex2));





//#### 练习3：实现一个函数 ex3，使用 safeProp 和 fp.first 找到 user 的名字的首字母


// let safeProp = fp.curry(function(x, o){
//     return Maybe.of(o[x])
// })
// let user = { id: 2, name: 'Albert' }
// let ex3 = (obj) => {
//     return fp.first(safeProp("name",obj)._value);
// }

// console.log(ex3(user));


//> 调用 ex3 函数传入 user 对象，safeProp 是经过柯里化处理的，可以先传“属性”参数，后传“对象”参数。safeProp 函数处理后返回 user 的值，再调用fp.first 获取首字母





//#### 练习4：使用 Maybe 重写 ex4，不要有 if 语句


// let ex4 = function(n){
//     if(n){
//         return parseInt(n)
//     }
// }


// //> MayBe 函子用来处理外部的空值情况，防止空值的异常，拿到函子的值之后进行 parseInt 转化
// Maybe.of(n).map(function(x){parseInt(x)});



// 四、手写实现 MyPromise 源码

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class MyPromise {
    //定义一个状态
    status = "PENDING";
    value = undefined;
    constructor(fn) {
        //立即执行所传的函数
        if (typeof fn != "Function") throw new TypeError("this params should be a function");
        fn(this.resolve, this.reject);
    }

    resolve = (value) => {
        if (this.status != PENDING) return;
        this.status = FULFILLED;
        this.value = value;
    }

    reject = (error) => {
        if (this.status != PENDING) return;
        this.status = REJECTED;
        this.value = error;
    }

    then = (successCallBack, failedCallBack) => {
        if (this.status == FULFILLED) {
            successCallBack(this.value);
        } else if (this.status == REJECTED) {
            failedCallBack(this.value);
        }
    }
}

let promise = new MyPromise(function (resolve, reject) {
    resolve(2);
})

promise.then(function (value) {
    console.log(value);
})

