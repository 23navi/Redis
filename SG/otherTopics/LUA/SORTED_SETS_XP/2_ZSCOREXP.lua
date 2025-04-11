-- SORTED SETS with EXPIRE by member
-- ZSCOREXP key member
---- This command returns the score of the member, or nil if the member doesn't exist.

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

local score = redis.call('ZSCORE', KEYS[1], KEYS[2])

local expireAt = redis.call('ZSCORE', ZSET_EXPIREAT_KEY, KEYS[2])

if expireAt == nil then
    return nil
elseif tonumber(expireAt) < now then
    redis.pcall('ZREM', KEYS[1], KEYS[2])
    redis.pcall('ZREM', ZSET_EXPIREAT_KEY, KEYS[2])
    return nil
else
    return score
end
