var Vow = require('vow'),
    DEFAULT_MAX_WEIGHT = 100,
    DEFAULT_TASK_WEIGHT = 1,
    Queue = module.exports = function(maxWeight) {
        this._pendingTasks = [];
        this._weight = 0;
        this._maxWeight = maxWeight || DEFAULT_MAX_WEIGHT;
    };

Queue.prototype = {
    enqueue : function(taskFn, taskWeight) {
        var task = {
                fn      : taskFn,
                weight  : taskWeight || DEFAULT_TASK_WEIGHT,
                promise : Vow.promise()
            };

        if(task.weight > this._maxWeight) {
            throw Error('task with weight ' +
                task.weight +
                ' couldn\'t be executed in queue with maxWeight ' +
                this._maxWeight);
        }

        this._allowRunTask(task)?
            this._runTask(task) :
            this._pendingTasks.push(task);

        return task.promise;
    },

    setMaxWeight : function(maxWeight) {
        this._maxWeight = maxWeight;
    },

    _runTask : function(task) {
        this._weight += task.weight;

        var promise = task.fn();
        promise.always(
            function() {
                this._weight -= task.weight;
                while(this._pendingTasks.length && this._allowRunTask(this._pendingTasks[0])) {
                    this._runTask(this._pendingTasks.shift());
                }
            },
            this);

        task.promise.sync(promise);
    },

    _allowRunTask : function(task) {
        return this._weight + task.weight <= this._maxWeight;
    }
};