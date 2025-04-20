-- HASH SETS with EXPIRE by fields
-- HKEYSXP key
---- This command returns keys still alive

local HSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local now = tonumber(redis.call('TIME')[1])

-- get the list of fields in arguments
local fields = {}
local k = ""
for i, k in pairs(redis.call('HKEYS', KEYS[1])) do
    -- get expireAt if the field exists and delete it if expired
    if tonumber(redis.call('HGET', HSET_EXPIREAT_KEY, k)) < now then
        redis.call('HDEL', KEYS[1], k)
        redis.call('HDEL', HSET_EXPIREAT_KEY, k)
    else
        table.insert(fields, k)
    end
end

return fields
