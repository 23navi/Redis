-- HASH SETS with EXPIRE by fields
-- HSETXP key expire(sec) field value [field value...]
---- This command creates a another HASH SETS whose key is KEYS[1]+'.EXPIREAT' contains EXPIREAT TIME by fields

local HSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local expireAt = tonumber(redis.call('TIME')[1]) + tonumber(KEYS[2])

local k = ""
for i, v in pairs(ARGV) do
    if i % 2 == 1 then
        k = v
        -- set / update expireAt whether the field exists or not
        redis.call('HSET', HSET_EXPIREAT_KEY, k, expireAt)
    else
        redis.call('HSET', KEYS[1], k, v)
    end
end

return true