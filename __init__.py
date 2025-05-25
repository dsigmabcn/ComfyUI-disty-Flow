from .flow.flow_node import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
from .flow.constants import WEB_DIRECTORY
#from .flow.server_setup import setup_server
from .flow.server_setup_runpod import setup_server #for this implementation, we use the script in server_setup_runpod and be able to open via port 7771
setup_server()
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS']
