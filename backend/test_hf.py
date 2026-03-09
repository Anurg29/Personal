import asyncio
from huggingface_hub import AsyncInferenceClient
from config import HUGGINGFACE_API_KEY
client = AsyncInferenceClient(token=HUGGINGFACE_API_KEY)
async def main():
    messages = [{"role": "user", "content": "hello"}]
    stream = await client.chat_completion(model="HuggingFaceH4/zephyr-7b-beta", messages=messages, stream=True, max_tokens=20)
    async for chunk in stream:
        print(chunk.choices[0].delta.content, end="")
asyncio.run(main())
