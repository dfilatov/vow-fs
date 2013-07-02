var Queue = require('../lib/queue'),
    Vow = require('vow');

module.exports = {
    'should run tasks while maxWeight not exceeded' : function(test) {
        var queue = new Queue(2),
            p1 = Vow.promise(),
            p2 = Vow.promise(),
            p3 = Vow.promise(),
            callCount = 0;

        queue.enqueue(function() {
            callCount++;
            return p1;
        });

        queue.enqueue(function() {
            callCount++;
            return p2;
        });

        queue.enqueue(function() {
            callCount++;
            return p3;
        });

        test.strictEqual(callCount, 2);
        test.done();
    },

    'should run tasks with the release of the queue' : function(test) {
        var queue = new Queue(2),
            p1 = Vow.promise(),
            p2 = Vow.promise(),
            p3 = Vow.promise(),
            callCount = 0;

        queue.enqueue(function() {
            callCount++;
            return p1;
        });

        queue.enqueue(function() {
            callCount++;
            return p2;
        });

        queue.enqueue(function() {
            callCount++;
            return p3;
        });

        queue.enqueue(function() {
            callCount++;
            return p3;
        });

        p1.fulfill();
        p1.then(function() {
            test.strictEqual(callCount, 3);
            test.done();
        });
    },

    'should run tasks with the release of the queue and according their weights' : function(test) {
        var queue = new Queue(5),
            p1 = Vow.promise(),
            p2 = Vow.promise(),
            p3 = Vow.promise(),
            p4 = Vow.promise(),
            p5 = Vow.promise(),
            callCount = 0;

        queue.enqueue(function() {
            callCount++;
            return p1;
        });

        queue.enqueue(function() {
            callCount++;
            return p2;
        }, 4);

        queue.enqueue(function() {
            callCount++;
            return p3;
        }, 2);

        queue.enqueue(function() {
            callCount++;
            return p4;
        }, 3);

        queue.enqueue(function() {
            callCount++;
            return p5;
        }, 2);

        test.strictEqual(callCount, 2);

        p1.fulfill();
        p1.then(function() {
            test.strictEqual(callCount, 2);
            p2.fulfill();
            p2.then(function() {
                test.strictEqual(callCount, 4);
                p4.fulfill();
                p4.then(function() {
                    test.strictEqual(callCount, 5);
                    test.done();
                });
            });
        });
    },

    'should throw exception if task weight more than max weight of queque' : function(test) {
        var queue = new Queue(5);
        test.throws(
            function() {
                queue.enqueue(function() {}, 6);
            },
            Error);

        test.done();
    }
};

