// Small explicit UI state: exactly one screen visible at a time.
// Placeholder navigation only — no game loop, snake logic, or persistence.

export type ScreenName =
  | "welcome"
  | "menu"
  | "difficulty"
  | "playing"
  | "paused"
  | "game-over"
  | "high-scores";

const SCREEN_IDS: Record<ScreenName, string> = {
  welcome: "screen-welcome",
  menu: "screen-menu",
  difficulty: "screen-difficulty",
  playing: "screen-playing",
  paused: "screen-paused",
  "game-over": "screen-gameover",
  "high-scores": "screen-scores",
};

const ACTION_TARGETS: Record<string, ScreenName> = {
  start: "playing",
  pause: "paused",
  resume: "playing",
  restart: "playing",
  end: "game-over",
  quit: "menu",
};

let activeScreen: ScreenName = "welcome";

function screenElement(name: ScreenName): HTMLElement | null {
  return document.getElementById(SCREEN_IDS[name]);
}

export function getActiveScreen(): ScreenName {
  return activeScreen;
}

export function showScreen(name: ScreenName): void {
  activeScreen = name;
  for (const key of Object.keys(SCREEN_IDS) as ScreenName[]) {
    const el = screenElement(key);
    if (el === null) continue;
    if (key === name) {
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }
  // Move keyboard focus to the active screen so hidden screens are never
  // reachable by Tab and screen-reader users land in the right place.
  screenElement(name)?.focus({ preventScroll: true });
}

function isScreenName(value: string): value is ScreenName {
  return value in SCREEN_IDS;
}

function selectDifficulty(button: HTMLButtonElement): void {
  const group = button.closest("ul");
  if (group === null) return;
  for (const other of group.querySelectorAll<HTMLButtonElement>("[data-difficulty]")) {
    other.setAttribute("aria-pressed", other === button ? "true" : "false");
  }
}

export function initUI(): void {
  showScreen("welcome");

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button");
    if (button === null) return;

    const difficulty = button.getAttribute("data-difficulty");
    if (difficulty !== null) {
      selectDifficulty(button);
      return;
    }

    const goto = button.getAttribute("data-goto");
    if (goto !== null && isScreenName(goto)) {
      showScreen(goto);
      return;
    }

    const action = button.getAttribute("data-action");
    if (action !== null && action in ACTION_TARGETS) {
      showScreen(ACTION_TARGETS[action]);
    }
  });
}
