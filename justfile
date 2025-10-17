# Set the absolute path to your `levered-client` monorepo.
# IMPORTANT: You must change this variable to match your local setup before running.
LEVERED_CLIENT_PATH := '/Users/sbumm/levered-client'

# Default recipe runs the main `relink-client` task.
default: relink-client


# A heavily instrumented recipe to debug the client linking process.
relink-client:
    # 1. Guard Clause
    @if [ ! -d '{{LEVERED_CLIENT_PATH}}' ]; then \
        echo "Error: The path '{{LEVERED_CLIENT_PATH}}' is not a valid directory."; \
        echo 'Please set the LEVERED_CLIENT_PATH variable in your Justfile first.'; \
        exit 1; \
    fi
    @echo "🚀 Relinking local @levered/client from '{{LEVERED_CLIENT_PATH}}'..."

    # 2. Clean up old state
    @echo "\n[STEP 1/6] Removing old symlink from this project..."
    @rm -f ./node_modules/@levered/client
    @echo "    -> Done."

    # 3. Perform a clean build of the client
    @echo "\n[STEP 2/6] Performing a clean build of the client..."
    @echo "    -> Removing old 'dist' directory..."
    @rm -rf '{{LEVERED_CLIENT_PATH}}/packages/client/dist'
    @echo "    -> Running build script..."
    @(cd '{{LEVERED_CLIENT_PATH}}' && npm run build --workspace=@levered/client)

    # 3. Perform a clean build of the agent
    @echo "\n[STEP 2/6] Performing a clean build of the agent..."
    @echo "    -> Removing old 'dist' directory..."
    @rm -rf '{{LEVERED_CLIENT_PATH}}/packages/agent/dist'
    @echo "    -> Running build script..."
    @(cd '{{LEVERED_CLIENT_PATH}}' && npm run build --workspace=@levered/agent)

    # 4. Verify that the build artifacts exist
    @echo "\n[STEP 3/6] Verifying build artifacts exist..."
    @echo "    -> Listing contents of '{{LEVERED_CLIENT_PATH}}/packages/client/dist':"
    @ls -l '{{LEVERED_CLIENT_PATH}}/packages/client/dist'

    # 5. Create the global link
    @echo "\n[STEP 3/5] Creating global link from source package..."
    @(cd '{{LEVERED_CLIENT_PATH}}/packages/client' && npm link)

    # 6. Create the local link MANUALLY
    @echo "\n[STEP 4/5] Manually creating local symlink to global package..."
    @ln -s `npm root -g`/@levered/client ./node_modules/@levered/client
    @echo "    -> Verifying local symlink in `pwd`/node_modules:"
    @ls -l ./node_modules/@levered/client

    # 7. Final verification
    @echo "\n[STEP 6/6] Verifying Node.js can resolve the module..."
    @node -e 'try { require.resolve("@levered/client"); console.log("✅ Success! Module resolved correctly."); } catch (e) { console.error("❌ Error: Module could not be resolved."); process.exit(1); }'
