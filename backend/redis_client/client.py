import redis.asyncio as aioredis

from constants import settings

client = aioredis.StrictRedis.from_url(
    settings.REDIS_URL,
    decode_responses=False,
)
