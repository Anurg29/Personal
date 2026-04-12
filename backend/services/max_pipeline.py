from __future__ import annotations

from typing import Any, Iterable

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_groq import ChatGroq


class MaxAssistantPipeline:
    """Automated assistant pipeline: retrieve context -> reason/tool use -> generate answer."""

    def __init__(
        self,
        *,
        api_key: str,
        model_ids: list[str],
        system_prompt: str,
        tools: Iterable[Any],
        memory_service: Any,
    ):
        self.api_key = api_key
        self.model_ids = model_ids
        self.system_prompt = system_prompt
        self.tools = list(tools)
        self.memory_service = memory_service
        self.tool_map = {tool.name: tool for tool in self.tools}

    def _build_llm(self, model_id: str) -> ChatGroq:
        llm = ChatGroq(
            model_name=model_id,
            api_key=self.api_key,
            temperature=0.5,
            max_tokens=1024,
        )
        return llm.bind_tools(self.tools)

    def _retrieve_memory_context(self, messages: list[dict[str, str]], use_memory: bool = True) -> str:
        if not use_memory:
            return ""

        user_messages = [m.get("content", "") for m in messages if m.get("role") == "user" and m.get("content", "").strip()]
        if not user_messages:
            return ""

        memories = self.memory_service.search_memories(user_messages[-1], k=5)
        if not memories:
            return ""

        lines = [
            f"{idx}. ({item.get('category', 'general')}) {item.get('content', '')}"
            for idx, item in enumerate(memories, start=1)
        ]
        return "\n".join(lines)

    def _prepare_messages(self, messages: list[dict[str, str]], use_memory: bool = True):
        memory_block = self._retrieve_memory_context(messages, use_memory=use_memory)

        prompt = self.system_prompt
        if memory_block:
            prompt = (
                f"{self.system_prompt}\n\n"
                "Personal RAG Memory Context (only use if relevant):\n"
                f"{memory_block}"
            )

        lc_messages = [SystemMessage(content=prompt)]
        for m in messages:
            if m.get("role") == "user":
                lc_messages.append(HumanMessage(content=m.get("content", "")))
            elif m.get("role") == "assistant":
                lc_messages.append(AIMessage(content=m.get("content", "")))

        return lc_messages

    async def _execute_reasoning_loop(self, chat: ChatGroq, messages: list[Any], max_rounds: int = 4) -> str:
        working = list(messages)

        for _ in range(max_rounds):
            response = await chat.ainvoke(working)
            tool_calls = getattr(response, "tool_calls", None) or []
            if not tool_calls:
                return response.content or ""

            working.append(response)

            for call in tool_calls:
                tool_name = call.get("name")
                tool_args = call.get("args", {})
                tool_id = call.get("id")

                tool_impl = self.tool_map.get(tool_name)
                if not tool_impl:
                    result = {"success": False, "error": f"Tool '{tool_name}' unavailable"}
                else:
                    try:
                        result = tool_impl.invoke(tool_args)
                    except Exception as exc:
                        result = {"success": False, "error": str(exc)}

                working.append(ToolMessage(content=str(result), tool_call_id=tool_id))

        return "I couldn't complete that workflow in one pass. Please rephrase with one clear action."

    async def run(self, messages: list[dict[str, str]], use_memory: bool = True) -> str:
        lc_messages = self._prepare_messages(messages, use_memory=use_memory)

        for model_id in self.model_ids:
            try:
                llm = self._build_llm(model_id)
                return await self._execute_reasoning_loop(llm, lc_messages)
            except Exception:
                continue

        raise RuntimeError("AI models are currently offline")
