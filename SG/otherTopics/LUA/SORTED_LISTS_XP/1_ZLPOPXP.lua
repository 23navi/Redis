-- SORTED LISTS with EXPIRE by member
-- ZLPOPXP key

local ZSET_SCORE_KEY = KEYS[1]..".SCORE"
local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"

local v = redis.call('LPOP', KEYS[1])
redis.call('ZREM', ZSET_EXPIREAT_KEY, v)
redis.call('ZREM', ZSET_SCORE_KEY, v)

return v
