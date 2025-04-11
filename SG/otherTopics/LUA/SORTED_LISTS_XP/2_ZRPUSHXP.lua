-- SORTED LISTS with EXPIRE by member
-- ZRPUSHXP key expire(sec) score member [score member...]
---- This command creates another SORTED LISTS whose keys are KEYS[1]+'.EXPIREAT' contains EXPIREAT TIME by member and KEYS[1]+'.SCORE' contains SCORE by member.

local ZSET_SCORE_KEY = KEYS[1]..".SCORE"
local ZSET_EXPIREAT_KEY = KEYS[1]..".EXPIREAT"
local expireAt = tonumber(redis.call('TIME')[1]) + tonumber(KEYS[2])

local s = "" -- score
for i, v in pairs(ARGV) do
    if i % 2 == 1 then
        s = v
    else
        -- v means member
        -- set / update expireAt whether the field exists or not
        redis.call('ZADD', ZSET_EXPIREAT_KEY, expireAt, v)
        redis.call('ZADD', ZSET_SCORE_KEY, s, v)
        redis.call('RPUSH', KEYS[1], v)
    end
end

return true
