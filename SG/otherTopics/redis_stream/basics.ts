import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();



// Add a message to a stream — XADD

await client.xAdd('mystream', '*', {
    user: 'john',
    message: 'hello world'
});


// Read from a stream — XRANGE (range by ID)

const messages = await client.xRange('mystream', '-', '+');
console.log(messages);



// Read the last N messages — XREVRANGE

const recent = await client.xRevRange('mystream', '+', '-', {
    COUNT: 5
});
console.log(recent);


// Read from stream as a consumer — XREAD

const data = await client.xRead(
    { key: 'mystream', id: '$' }, // $ = read only new messages
    { BLOCK: 5000 }               // wait up to 5s
);
console.log(data);



// Create Consumer Group — XGROUP CREATE


try {
    await client.xGroupCreate('mystream', 'mygroup', '0', { MKSTREAM: true });
} catch (e) {
    if (!e.message.includes('BUSYGROUP')) throw e; // ignore if already exists
}



// Read as a Consumer Group Member — XREADGROUP

const groupMessages = await client.xReadGroup(
    'mygroup',
    'consumer-1',
    { key: 'mystream', id: '>' }, // '>' = new messages
    { COUNT: 10, BLOCK: 5000 }
);
console.log(groupMessages);



// Acknowledge message — XACK

await client.xAck('mystream', 'mygroup', '1686578822235-0');


// Delete message — XDEL

await client.xDel('mystream', '1686578822235-0');
