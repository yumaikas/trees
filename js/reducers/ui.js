import produce from "immer";

export function uiInitState() {
    return {
        // Can be one of "one-line" or "multi-line"
        // In the future, we'll want to add a "mouse"/"moubile" mode as well, but too much for now.
        mode: "one-line",
        message: null,
    }
}

export const runUi = produce((draft, action) => {
    switch (action.cmd) {
        case "mode-one-line":
            draft.mode = "one-line";
            break;
        case "mode-multi-line":
            draft.mode = "multi-line";
            break;
        case "show-message":
            draft.message = action.message;
            break;
        case "clear-message":
            draft.message = "";
        default:
            break;
    }
});

