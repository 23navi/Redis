-- HASH SETS with EXPIRE by fields
-- HGETALLXP key
---- This command returns fields and values still alive

local HSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

-- get the list of fields in arguments, also values
local field_values = {}
local k = ""
local skip = false
for i, v in pairs(redis.call('HGETALL', KEYS[1])) do
    if i % 2 == 1 then
        k = v
        -- get expireAt if the field exists and delete it if expired
        if tonumber(redis.call('HGET', HSET_EXPIREAT_KEY, k)) < now then
            redis.call('HDEL', KEYS[1], k)
            redis.call('HDEL', HSET_EXPIREAT_KEY, k)
            skip = true
        else
            table.insert(field_values, k)
        end
    else
        if not skip then
            table.insert(field_values, v)
        end
        skip = false
    end
end

return field_values
