# CreateAI Studio

CreateAI is a polished React/Vite project-generation workspace. The home page keeps the original dark, premium visual direction while replacing the former demo gallery with a practical creation workflow.

## What it does

- Describe a website or app idea in a natural-language prompt.
- Generate an editable starter project locally in the browser.
- Open a live preview in an isolated iframe.
- Browse generated HTML, CSS, JavaScript and README files.
- Reuse recent prompts.
- Download the generated project as a ZIP directly from the browser.
- No Ollama setup and no paid API key are required for the built-in generator.

## Run

```bash
npm install
npm run dev
```

## Important

The included generator is browser-side and deterministic: it creates a functional starter project from the user's brief without pretending to call an external AI service. A real model provider can be connected later behind the same generation interface if desired.
