from __future__ import annotations

import os
from datetime import datetime
from typing import List, Dict, Any
from uuid import uuid4

from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "data", "max_vector_db")


class MaxRAGMemory:
    """Persistent vector memory for M.A.X. personalization and retrieval."""

    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self.vector_store = Chroma(
            collection_name="max_personal_memory",
            embedding_function=self.embeddings,
            persist_directory=VECTOR_STORE_DIR,
        )

    def add_memory(self, content: str, category: str = "general", source: str = "manual") -> Dict[str, Any]:
        content = content.strip()
        if not content:
            raise ValueError("Memory content cannot be empty")

        memory_id = str(uuid4())
        metadata = {
            "category": category,
            "source": source,
            "created_at": datetime.utcnow().isoformat(),
        }

        doc = Document(page_content=content, metadata=metadata)
        self.vector_store.add_documents([doc], ids=[memory_id])

        return {"id": memory_id, "content": content, "metadata": metadata}

    def search_memories(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        if not query.strip():
            return []

        docs = self.vector_store.similarity_search_with_score(query, k=k)
        results = []
        for doc, score in docs:
            results.append(
                {
                    "id": doc.metadata.get("id", ""),
                    "content": doc.page_content,
                    "category": doc.metadata.get("category", "general"),
                    "source": doc.metadata.get("source", "manual"),
                    "created_at": doc.metadata.get("created_at"),
                    "score": float(score),
                }
            )
        return results

    def list_memories(self, limit: int = 50) -> List[Dict[str, Any]]:
        payload = self.vector_store.get(include=["documents", "metadatas"], limit=limit)
        ids = payload.get("ids", [])
        documents = payload.get("documents", [])
        metadatas = payload.get("metadatas", [])

        data = []
        for idx, memory_id in enumerate(ids):
            meta = metadatas[idx] if idx < len(metadatas) and metadatas[idx] else {}
            data.append(
                {
                    "id": memory_id,
                    "content": documents[idx] if idx < len(documents) else "",
                    "category": meta.get("category", "general"),
                    "source": meta.get("source", "manual"),
                    "created_at": meta.get("created_at"),
                }
            )

        data.sort(key=lambda x: x.get("created_at") or "", reverse=True)
        return data

    def delete_memory(self, memory_id: str):
        self.vector_store.delete(ids=[memory_id])


max_rag_memory = MaxRAGMemory()
