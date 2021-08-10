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
    if (draft.message) {
        draft.message == null;
    }

    switch (action.cmd) {
        case "show-message":
            draft.message = action.message;
            break;
        default:
            break;
    }
    
});

