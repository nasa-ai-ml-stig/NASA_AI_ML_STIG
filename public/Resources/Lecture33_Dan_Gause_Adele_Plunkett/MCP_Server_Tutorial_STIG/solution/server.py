"""A minimal MCP server that resolves extragalactic object names via NED."""

import json

import httpx
from fastmcp import FastMCP

NED_LOOKUP_URL = "https://ned.ipac.caltech.edu/srs/ObjectLookup"

mcp = FastMCP("ned")


@mcp.tool
def resolve_object(name: str) -> dict:
    """Resolve an EXTRAGALACTIC object name to J2000 coordinates using NED.

    Covers extragalactic objects only (galaxies, quasars, galaxy clusters, etc.).
    Do NOT use for stars, planets, or other Milky Way objects -- NED is not an
    authoritative source for them.

    Args:
        name: Object name, e.g. "M87", "NGC 1275", "3C 273".

    Returns:
        The NED preferred name, RA/Dec in decimal degrees (J2000), the NED
        object type code (e.g. "G" = galaxy, "QSO" = quasar), and redshift.
    """
    payload = {"json": json.dumps({"name": {"v": name}})}
    response = httpx.post(NED_LOOKUP_URL, data=payload, timeout=10.0)
    response.raise_for_status()
    result = response.json()

    preferred = result.get("Preferred")
    if result.get("ResultCode") != 3 or not preferred:
        return {"error": f"NED could not resolve '{name}' to a unique object."}

    return {
        "name": preferred["Name"],
        "ra_deg": preferred["Position"]["RA"],
        "dec_deg": preferred["Position"]["Dec"],
        "object_type": preferred["ObjType"]["Value"],
        "redshift": (preferred.get("Redshift") or {}).get("Value"),
    }


if __name__ == "__main__":
    mcp.run()  # stdio transport by default
