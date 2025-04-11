-- SORTED SETS with EXPIRE by member
-- ZREMRANGEBYSCORE key min max
---- This command remove members whose score between min and max from the sorted set.

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"

for m in redis.call('ZRANGEBYSCORE', KEYS[1], KEYS[2], KEYS[3]) do
    redis.call('ZREM', ZSET_EXPIREAT_KEY, m)
end
redis.call('ZREM', KEYS[1], KEYS[2], KEYS[3])
