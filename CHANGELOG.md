## [Unreleased] - 2025-05-26

### Added
- `.gitignore`: Added to exclude cache, backup, and temporary files.
- `web/model_manager/css/`: New directory for model manager styling.
- `web/model_manager/js/main copy.js`: Backup or experimental JS file.
- `web/model_manager/backup_index.html`: Backup of the model manager UI.
- `web/flows/`: New directory for flow definitions (structure added).

### Changed
- `flow/api_handlers.py`: Updated to support model manager API endpoints.
- `flow/flow_manager.py`: Enhanced flow logic to integrate model manager functionality.
- `web/model_manager/index.html`: Improved UI layout and structure.
- `web/model_manager/js/main.js`: Refactored JavaScript logic for better interactivity and modularity.

### Notes
- Cleaned up untracked files and added `.gitignore` to maintain a cleaner working directory.



## [Unreleased] - 2025-05-25

### Added
- `flow/server_setup_runpod.py`: Initial setup script for RunPod server.
- `web/model_manager/flowConfig.json`: Configuration for model manager.
- `web/model_manager/index.html`: UI for model manager.
- `web/model_manager/js/main.js`: JavaScript logic for model manager.

### Changed
- Updated styling in `web/core/css/main.css`.
- Modified flow logic in `flow/api_handlers.py`, `flow/constants.py`, and `flow/flow_manager.py`.
- Updated `web/flow/index.html` layout.

### Removed
- Deleted outdated linker configs: `web/linker/flowConfig.json`, `web/linker/wf.json`.

### Notes
- `.ipynb_checkpoints` and temporary files excluded from commit.
