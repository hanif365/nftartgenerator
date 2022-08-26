import { useState } from 'react';


function getRandom (weights) {
    // weights = [0.3, 0.3, 0.3, 0.1]
    var num = Math.random(),
        s = 0,
        lastIndex = weights.length - 1;

    for (var i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
            return i + 1;
        }
    }

    return lastIndex + 1;
};
