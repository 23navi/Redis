-- TTLAT key
--- This command returns a key's ExpireAt Time

local t = tonumber(redis.call('TTL', KEYS[1]))
if t > 0 then
  t = t + tonumber(redis.call('TIME')[1])
end

return t
