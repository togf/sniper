import { storage } from "@vendetta/plugin";
import Settings from "./Settings";
import { registerCommand, unregisterCommand } from "@vendetta/commands";
import { showToast } from "@vendetta/ui/toasts";
import { logger } from "@vendetta";

let intervalID: NodeJS.Timeout;
let commandIDs = [];

const checkUsername = async (name: string): Promise<boolean> => {
  const res = await fetch("https://discord.com/api/v9/users/@me", {
    method: "PATCH",
    headers: {
      Authorization: storage.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: name,
      discriminator: "0000",
    }),
  });

  const data = await res.json();
  return !data.errors?.username;
};

const generateTargets = (): string[] => {
  const targets: Set<string> = new Set();

  if (storage.watch4l) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 10; i++) {
      let word = "";
      for (let j = 0; j < 4; j++) {
        word += chars[Math.floor(Math.random() * chars.length)];
      }
      targets.add(word);
    }
  }

  if (storage.watch3c) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
      let word = "";
      for (let j = 0; j < 3; j++) {
        word += chars[Math.floor(Math.random() * chars.length)];
      }
      targets.add(word);
    }
  }

  if (storage.customList?.length > 0) {
    const list = storage.customList
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean);
    list.forEach((x) => targets.add(x));
  }

  return [...targets];
};

const startSniper = () => {
  if (intervalID) clearInterval(intervalID);
  if (!storage.token) {
    showToast("Token not set in settings.");
    return;
  }

  logger.log("Username Sniper started.");
  showToast("Sniper started.");

  intervalID = setInterval(async () => {
    const names = generateTargets();
    for (const name of names) {
      try {
        const available = await checkUsername(name);
        if (available) {
          showToast(`Username available: ${name}`);
          logger.log(`Available: ${name}`);
        }
      } catch (err) {
        logger.log(`Error checking ${name}: ${err.message}`);
      }
    }
  }, (storage.interval || 30) * 1000);
};

const stopSniper = () => {
  if (intervalID) {
    clearInterval(intervalID);
    logger.log("Username Sniper stopped.");
    showToast("Sniper stopped.");
  }
};

export default {
  onLoad: () => {
    commandIDs.push(
      registerCommand({
        name: "startchecker",
        description: "Start username checker",
        execute: () => {
          startSniper();
          return { content: "Started username checker" };
        },
      })
    );

    commandIDs.push(
      registerCommand({
        name: "stopchecker",
        description: "Stop username checker",
        execute: () => {
          stopSniper();
          return { content: "Stopped username checker" };
        },
      })
    );

    // logger.log("Username Sniper Plugin loaded");
  },

  onUnload: () => {
    stopSniper();
    commandIDs.forEach(unregisterCommand);
    commandIDs = [];
  },

  settings: Settings({ startSniper, stopSniper }),
};
