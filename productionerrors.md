2025-11-16T06:42:56.884Z	Initializing build environment...
2025-11-16T06:42:56.884Z	Initializing build environment...
2025-11-16T06:48:52.407Z	Initializing build environment...
2025-11-16T06:48:54.408Z	Success: Finished initializing build environment
2025-11-16T06:48:54.728Z	Cloning repository...
2025-11-16T06:48:56.139Z	Restoring from dependencies cache
2025-11-16T06:48:56.143Z	Restoring from build output cache
2025-11-16T06:48:56.150Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2025-11-16T06:48:56.504Z	Installing project dependencies: npm clean-install --progress=false
2025-11-16T06:49:00.574Z	npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
2025-11-16T06:49:00.655Z	npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
2025-11-16T06:49:04.703Z	
2025-11-16T06:49:04.703Z	added 154 packages, and audited 155 packages in 8s
2025-11-16T06:49:04.704Z	
2025-11-16T06:49:04.704Z	22 packages are looking for funding
2025-11-16T06:49:04.704Z	  run `npm fund` for details
2025-11-16T06:49:04.705Z	
2025-11-16T06:49:04.706Z	found 0 vulnerabilities
2025-11-16T06:49:04.884Z	Executing user build command: npm install
2025-11-16T06:49:05.981Z	
2025-11-16T06:49:05.981Z	up to date, audited 155 packages in 787ms
2025-11-16T06:49:05.982Z	
2025-11-16T06:49:05.982Z	22 packages are looking for funding
2025-11-16T06:49:05.982Z	  run `npm fund` for details
2025-11-16T06:49:05.984Z	
2025-11-16T06:49:05.984Z	found 0 vulnerabilities
2025-11-16T06:49:05.999Z	Success: Build command completed
2025-11-16T06:49:06.123Z	Executing user deploy command: npx wrangler deploy
2025-11-16T06:49:11.051Z	npm warn exec The following package was not found and will be installed: wrangler@4.47.0
2025-11-16T06:49:27.210Z	
2025-11-16T06:49:27.211Z	 ⛅️ wrangler 4.47.0
2025-11-16T06:49:27.211Z	───────────────────
2025-11-16T06:49:27.230Z	
2025-11-16T06:49:27.367Z	✘ [ERROR] Missing entry-point to Worker script or to assets directory
2025-11-16T06:49:27.367Z	
2025-11-16T06:49:27.367Z	  
2025-11-16T06:49:27.367Z	  If there is code to deploy, you can either:
2025-11-16T06:49:27.368Z	  - Specify an entry-point to your Worker script via the command line (ex: `npx wrangler deploy src/index.ts`)
2025-11-16T06:49:27.368Z	  - Or create a "wrangler.jsonc" file containing:
2025-11-16T06:49:27.368Z	  
2025-11-16T06:49:27.368Z	  ```
2025-11-16T06:49:27.368Z	  {
2025-11-16T06:49:27.369Z	    "name": "worker-name",
2025-11-16T06:49:27.369Z	    "compatibility_date": "2025-11-16",
2025-11-16T06:49:27.369Z	    "main": "src/index.ts"
2025-11-16T06:49:27.369Z	  }
2025-11-16T06:49:27.369Z	  ```
2025-11-16T06:49:27.370Z	  
2025-11-16T06:49:27.373Z	  
2025-11-16T06:49:27.373Z	  If are uploading a directory of assets, you can either:
2025-11-16T06:49:27.373Z	  - Specify the path to the directory of assets via the command line: (ex: `npx wrangler deploy --assets=./dist`)
2025-11-16T06:49:27.373Z	  - Or create a "wrangler.jsonc" file containing:
2025-11-16T06:49:27.374Z	  
2025-11-16T06:49:27.374Z	  ```
2025-11-16T06:49:27.374Z	  {
2025-11-16T06:49:27.374Z	    "name": "worker-name",
2025-11-16T06:49:27.374Z	    "compatibility_date": "2025-11-16",
2025-11-16T06:49:27.374Z	    "assets": {
2025-11-16T06:49:27.375Z	      "directory": "./dist"
2025-11-16T06:49:27.375Z	    }
2025-11-16T06:49:27.375Z	  }
2025-11-16T06:49:27.375Z	  ```
2025-11-16T06:49:27.375Z	  
2025-11-16T06:49:27.375Z	
2025-11-16T06:49:27.376Z	
2025-11-16T06:49:27.395Z	
2025-11-16T06:49:27.395Z	Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
2025-11-16T06:49:27.423Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2025-11-16_06-49-26_243.log"
2025-11-16T06:49:27.626Z	Failed: error occurred while running deploy command