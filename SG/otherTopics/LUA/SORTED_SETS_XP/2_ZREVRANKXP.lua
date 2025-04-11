-- SORTED SETS with EXPIRE by member
-- ZREVRANKXP key member
---- This command returns the rank of member in the sorted set stored at key, with the scores ordered with descending order, -1 if member doesn't exist.

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

local rank = redis.call('ZREVRANK', KEYS[1], KEYS[2])

if tonumber(redis.call('ZSCORE', ZSET_EXPIREAT_KEY, KEYS[2])) < now then
    redis.call('ZREM', KEYS[1], KEYS[2])
    redis.call('ZREM', ZSET_EXPIREAT_KEY, KEYS[2])
    return -1
else
    return rank
end
