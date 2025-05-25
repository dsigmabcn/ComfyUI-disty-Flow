from aiohttp import web
import asyncio
import server
from .flow_manager import FlowManager
from .downloader import download_update_flows
from .constants import FLOWMSG, logger

# Redirect handler for port 7771
async def redirect_handler(request):
    #raise web.HTTPFound(location='https://00oahc9jsnlvcf-8188.proxy.runpod.net/flow')
    #host = request.host  # e.g., 'abc123-7771.proxy.runpod.net'
    host = request.headers.get('X-Forwarded-Host', request.host)
    print (f"host is {host}")
    flow_host = host.replace('-7771', '-8188')
    print (f"flow_host is {host}")
    flow_url = f"https://{flow_host}/flow"
    print (f"flow_url is {host}")
    raise web.HTTPFound(location=flow_url)

def start_redirect_server():
    async def run():
        app = web.Application()
        app.router.add_get('/', redirect_handler)

        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', 7771)
        await site.start()
        logger.info(f"{FLOWMSG}: Redirect server running on port 7771")

        # Keep the server running
        while True:
            await asyncio.sleep(3600)

    # Run the redirect server in a background thread
    import threading
    threading.Thread(target=lambda: asyncio.run(run()), daemon=True).start()

def setup_server() -> None:
    try:
        server_instance = server.PromptServer.instance
    except Exception as e:
        logger.error(f"{FLOWMSG}: Failed to get server instance: {e}")
        return

    download_update_flows()

    try:
        FlowManager.setup_app_routes(server_instance.app)
    except Exception as e:
        logger.error(f"{FLOWMSG}: Failed to set up app routes: {e}")

    # Start redirect server
    start_redirect_server()