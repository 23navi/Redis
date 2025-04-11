-- SORTED LISTS with EXPIRE by member
-- ZLRANGEBYSCOREXP key min max

local ZSET_SCORE_KEY = KEYS[1]..".SCORE"
local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

local results = {}
for i, v in pairs(redis.call('ZRANGEBYSCORE', ZSET_SCORE_KEY, KEYS[2], KEYS[3])) do
    if tonumber(redis.call('ZSCORE', ZSET_EXPIREAT_KEY, v)) < now then
        redis.call('ZREM', ZSET_SCORE_KEY, v)
        redis.call('ZREM', ZSET_EXPIREAT_KEY, v)
    else
        table.insert(results, v)
    end
end

return results
