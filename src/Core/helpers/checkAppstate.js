import { resolve as resolvePath } from "path";
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { config } from "dotenv";
config();

/**
 * Check the encrypt state of the appstate then return the decrypted one.
 */
async function checkAppstate(APPSTATE_PATH, APPSTATE_PROTECTION) {
    const logger = global.modules.get("console");

    let objAppState;
    APPSTATE_PATH = resolvePath(APPSTATE_PATH);

    if (!isExists(APPSTATE_PATH, "file")) {
        throw getLang("modules.checkAppstate.error.noAppstate");
    } else {
        logger.custom(getLang("modules.checkAppstate.foundAppstate"), "LOGIN");
    }

    let appState = readFileSync(APPSTATE_PATH, "utf8");
    appState = appState.startsWith('"') ? JSON.parse(appState) : appState; // fixed...

    if (APPSTATE_PROTECTION !== true) {
        logger.custom(getLang("modules.checkAppstate.noProtection"), "LOGIN");
        objAppState = await getAppStateNoProtection(
            APPSTATE_PATH,
            appState
        );
    } else {
        logger.custom(
            getLang("modules.checkAppstate.error.notSupported"),
            "LOGIN",
            "\x1b[33m"
        );
        objAppState = await getAppStateNoProtection(
            APPSTATE_PATH,
            appState
        );
    }

    return objAppState;
}

async function getAppStateNoProtection(
    APPSTATE_PATH,
    appState
) {
    const logger = global.modules.get("console");
    const aes = global.modules.get("aes");

    let objAppState;

    try {
        if (isJSON(appState)) {
            objAppState = JSON.parse(appState);
            if (objAppState.length == 0) {
                throw getLang("modules.checkAppstate.error.invalid");
            }
        } else {
            throw getLang("modules.checkAppstate.error.invalid");
        }
    } catch (error) {
        throw error;
    }

    return objAppState;
}

export default checkAppstate;
