-- SORTED SETS with EXPIRE by member
-- ZCOUNTXP key start_index stop_index
---- This command returns the number of keys still alive between min and max

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

local c = 0
for i, m in pairs(redis.call('ZRANGE', KEYS[1], KEYS[2], KEYS[3])) do
    if tonumber(redis.call('ZSCORE', ZSET_EXPIREAT_KEY, m)) < now then
        redis.pcall('ZREM', KEYS[1], m)
        redis.pcall('ZREM', ZSET_EXPIREAT_KEY, m)
    else
        c = c + 1
    end
end

return c
