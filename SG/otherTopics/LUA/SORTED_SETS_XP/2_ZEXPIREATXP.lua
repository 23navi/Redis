-- SORTED SETS with EXPIRE by member
-- ZEXPIREAT key member
---- This command returns the expire time of the member, or nil if the member is already expired.

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

local expireAt = redis.call('ZSCORE', ZSET_EXPIREAT_KEY, KEYS[2])

if expireAt == nil then
    return nil
elseif tonumber(expireAt) < now then
    redis.pcall('ZREM', KEYS[1], KEYS[2])
    redis.pcall('ZREM', ZSET_EXPIREAT_KEY, KEYS[2])
    return nil
else
    return expireAt
end
