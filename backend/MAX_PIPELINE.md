# M.A.X. Automated RAG Pipeline

This backend now runs M.A.X. with an explicit pipeline:

1. **Retrieve** personal context from vector memory (`Chroma`)
2. **Reason + Call tools** (Gmail / Drive / Market / GitHub)
3. **Generate final answer** with model fallback

## Vector DB

- Store path: `backend/data/max_vector_db`
- Embeddings: `sentence-transformers/all-MiniLM-L6-v2`
- Service: `backend/services/max_rag.py`

## Pipeline Service

- File: `backend/services/max_pipeline.py`
- Router integration: `backend/routers/chat.py`

## Key Endpoints

### Chat (pipeline enabled)
- `POST /api/chat`
- `POST /api/chat/sync`

Request body:

```json
{
  "messages": [{ "role": "user", "content": "what is my latest email" }],
  "use_memory": true
}
```

### Memory management
- `POST /api/chat/memory` — add memory
- `GET /api/chat/memory` — list memory
- `DELETE /api/chat/memory/{memory_id}` — delete memory

### Automated ingestion pipeline
- `POST /api/chat/pipeline/auto-ingest`

Example request:

```json
{
  "ingest_latest_emails": true,
  "ingest_drive_folders": true,
  "email_count": 5,
  "folder_count": 10
}
```

This auto-syncs Gmail + Drive metadata into vector memory so M.A.X. answers personal queries with higher relevance.

## Notes

- Google tools require OAuth connection (`/api/google/connect`).
- If Gmail/Drive auth is not configured, M.A.X. returns a connect instruction.
