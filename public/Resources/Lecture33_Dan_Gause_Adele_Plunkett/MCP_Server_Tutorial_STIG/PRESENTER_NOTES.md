# Presenter Notes: Live Demo

Run-of-show for presenting the [README](README.md) tutorial live, as done in the
[NASA AI/ML STIG Lecture Series talk on 9 November 2026](https://science.nasa.gov/astrophysics/programs/cosmic-origins/community/ai-ml-stig-lecture-series-9-nov-2026/).
Takes about 10 minutes.

## Before you go on

```bash
cd workspace
claude mcp remove ned -s local     # ignore the error if it isn't registered
rm -rf ./* .venv .jupyter          # workspace/ should be empty
```

- Open a terminal in `workspace/` and make the font large.
- Have `prompt.txt` open and ready to copy.
- Fallback: if the live build fails, `cp ../solution/* .` and continue from step 4.

## Run-of-show

1. **Set the scene.** Today we build a simple MCP server with Claude Code.
   It gives Claude one new ability: looking up galaxies in NED.
2. **Show the plugin.** Run `/plugin`, search for `mcp-server-dev`, and show
   that it is installed.
3. **Build it.** Briefly compare Claude Code with Claude Desktop and the web
   app. Then paste `prompt.txt` into Claude Code.
4. **Walk through `server.py`.** Point out `FastMCP("ned")`, `@mcp.tool`,
   and the docstring.
5. **Inspect it.** Run `uv run fastmcp dev inspector server.py`. Connect,
   then go to **Tools** and call `resolve_object` with `M87`.
6. **Register it.** Run `claude mcp add ned -- uv run --directory "$(pwd)" server.py`.
7. **Use it.** Start a new Claude session and ask:
   *"What are the coordinates of M87?"*
