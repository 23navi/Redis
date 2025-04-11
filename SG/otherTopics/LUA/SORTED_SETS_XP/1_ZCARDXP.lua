-- SORTED SETS with EXPIRE by member
-- ZCARDXP key
---- This command returns the number of keys still alive

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

local c = 0
local m = ""
for i, v in pairs(redis.call('ZRANGE', ZSET_EXPIREAT_KEY, 0, -1, "WITHSCORES")) do
    if i % 2 == 1 then
        m = v
    else
        if tonumber(v) < now then
            redis.call('ZREM', KEYS[1], m)
            redis.call('ZREM', ZSET_EXPIREAT_KEY, m)
        else
            c = c + 1
        end
    end
end

return c
