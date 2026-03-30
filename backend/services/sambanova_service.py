import os
import httpx
import json
from typing import List, Dict, Any, Optional

class SambaNovaService:
    def __init__(self):
        self.api_key = os.getenv("SAMBANOVA_API_KEY")
        self.base_url = "https://api.sambanova.ai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def _call_api(self, messages: List[Dict[str, str]], json_mode: bool = False) -> str:
        payload = {
            "model": "Meta-Llama-3.1-405B-Instruct", # Default model for SambaNova or what's available
            "messages": messages,
            "response_format": {"type": "json_object"} if json_mode else None,
            "stream": False
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(self.base_url, headers=self.headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']

    async def summarize_text(self, text: str) -> str:
        system_prompt = "You are an expert academic assistant. Summarize the following text clearly and concisely."
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Text: {text[:8000]}"} # Limit input length for context
        ]
        return await self._call_api(messages)

    async def generate_mindmap(self, text: str) -> Dict[str, Any]:
        system_prompt = """You are a knowledge graph expert. Generate a hierarchical structure from the text in JSON format for a mind map. 
        Example Output Format:
        {
          "title": "Main Topic",
          "children": [
            {
              "title": "Subtopic 1",
              "children": [
                {"title": "Detail 1.1"},
                {"title": "Detail 1.2"}
              ]
            }
          ]
        }
        Only return the JSON."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Extract the mind map for: {text[:8000]}"}
        ]
        response_text = await self._call_api(messages)
        # Attempt to parse json from response text if it contains extra characters
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Simple fallback or regex cleanup
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return {"title": "Error Processing", "children": []}

    async def generate_flashcards(self, text: str) -> List[Dict[str, str]]:
        system_prompt = """Generate a list of questions and answers for flashcards based on the provided text.
        Format: JSON array of objects with 'question' and 'answer' keys.
        Only return the JSON."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Text: {text[:8000]}"}
        ]
        response_text = await self._call_api(messages)
        try:
            return json.loads(response_text)
        except:
             return [{"question": "Error", "answer": "Unable to generate flashcards."}]

    async def chat_with_context(self, question: str, context: str, history: List[Dict[str, str]] = []) -> str:
        system_prompt = f"You are SmartNotes AI. Use the following context to answer the user's question. If the answer is not in the context, say that you don't know based on the provided notes.\n\nContext:\n{context[:10000]}"
        
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history[-10:]) # Keep only recent history
        messages.append({"role": "user", "content": question})
        
        return await self._call_api(messages)

    async def generate_flowchart(self, text: str) -> str:
        """Generates Mermaid.js flowchart code."""
        system_prompt = "You are a workflow expert. Create a Mermaid.js flowchart representing the process or sequence described in the text. Return ONLY the mermaid code starting with flowchart TD or graph TD."
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Generate flowchart for: {text[:8000]}"}
        ]
        return await self._call_api(messages)

sambanova_service = SambaNovaService()
