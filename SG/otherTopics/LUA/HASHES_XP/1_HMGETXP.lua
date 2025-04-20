-- HASH SETS with EXPIRE by fields
-- HMGETXP key field [field ...]
---- This command returns fields and values still alive

local HSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

-- get the list of values in arguments
local values = {}
local skip = false
for i, field in pairs(ARGV) do
    -- get expireAt if the field exists and delete it if expired
    if tonumber(redis.call('HGET', HSET_EXPIREAT_KEY, field)) < now then
        redis.call('HDEL', KEYS[1], field)
        redis.call('HDEL', HSET_EXPIREAT_KEY, field)
    else
        table.insert(values, redis.call('HGET', KEYS[1], field))
    end
end

return values
