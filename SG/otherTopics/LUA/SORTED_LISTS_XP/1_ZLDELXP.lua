-- SORTED LISTS with EXPIRE by member
-- ZLDELXP key

local ZSET_SCORE_KEY = KEYS[1]..".SCORE"
local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"

redis.call('DEL', KEYS[1])
redis.call('DEL', ZSET_SCORE_KEY)
redis.call('DEL', ZSET_EXPIREAT_KEY)

return true
