const v8 = require('v8');
const l = Math.round(v8.getHeapStatistics().heap_size_limit / 1024 / 1024);
console.log(`[probe] pid=${process.pid} IS_NEXT_WORKER=${process.env.IS_NEXT_WORKER||'-'} heap_limit=${l}MB NODE_OPTIONS="${process.env.NODE_OPTIONS||''}" execArgv=${JSON.stringify(process.execArgv)}`);
