-- SORTED SETS with EXPIRE by member
-- ZREMXP key member [member ...]
---- This command remove members from the sorted set.

local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"

redis.call('ZREM', KEYS[1], unpack(ARGV))
redis.call('ZREM', ZSET_EXPIREAT_KEY, unpack(ARGV))
