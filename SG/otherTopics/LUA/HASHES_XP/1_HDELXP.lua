-- HASH SETS with EXPIRE by fields
-- HDELXP key field [field ...]
---- This command deletes fields in key

local HSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
for i, k in pairs(ARGV) do
    redis.call('HDEL', KEYS[1], k)
    redis.call('HDEL', HSET_EXPIREAT_KEY, k)
end

return true
