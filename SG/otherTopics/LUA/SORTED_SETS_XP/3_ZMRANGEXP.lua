-- SORTED SETS with EXPIRE by member
-- ZRANGEXP key min max [WITHSCORES]
---- This command returns the number of keys still alive between min and max

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

local results = {}
local k = ""
local skip = false
local expireAt = {}
for i, v in pairs(redis.pcall('ZRANGE', ZSET_EXPIREAT_KEY, 0, -1, "WITHSCORES")) do
    if i % 2 == 1 then
        k = v
    else
        expireAt[k]=v
    end
end

for i, v in pairs(redis.pcall('ZRANGE', KEYS[1], KEYS[2], KEYS[3], unpack(ARGV))) do
    if ARGV[1] == "WITHSCORES" then
        if i % 2 == 1 then
            k = v
            if tonumber(expireAt[k]) < now then
                redis.call('ZREM', KEYS[1], k)
                redis.call('ZREM', ZSET_EXPIREAT_KEY, k)
                skip = true
            else
                table.insert(results, k)
            end
        else
            if not skip then
                table.insert(results, v)
            end
            skip = false
        end
    else
        if tonumber(expireAt[v]) < now then
            redis.call('ZREM', KEYS[1], v)
            redis.call('ZREM', ZSET_EXPIREAT_KEY, v)
        else
            table.insert(results, v)
        end
    end
end

return results
