import {saveOutline} from "../client";
import produce, {current} from "immer";

/*
let outline = {
    table: {}
    outline: {
        id: 0, 
        description: "name",
        children: []
    },
    selected_node = 0,
    top_node = 0,
    new_id = 1,
    document_url: "",
    // Use for detectecting version conflicts with 
    changed_timestamp: 1212312
}
*/

export function newOutline(name, url_id, createdTS) {
    let topNode = {
        id: 0,
        parent_id: null,
        description: name,
        children: [],
        open: true,
    };
    let table = {};
    table[0] = topNode;

    let outline = {
        table: table,
        outline: topNode,
        selected_node: 0,
        top_node: 0,
        new_id: 1,
        document_url_id: url_id,
        changed_timestamp: createdTS,
        message: null,
    };

    return outline;
}

export const outlineDb = produce((draft, action) => {
    if (draft.message) {
        draft.message = null;
    }
    switch (action.cmd) {
        case "show-message":
            draft.message = action.message;
            break;
        case "add-child":  
            var n = draft.table[draft.selected_node];
            action.node.id = draft.new_id;
            action.node.parent_id = draft.selected_node;
            action.node.open = true;
            draft.new_id = draft.new_id + 1;
            draft.table[action.node.id] = action.node;
            n.children.push(action.node.id);
            draft.changed_timestamp = Date.now();
            break;
        case "append-sibling":
            var n = draft.table[draft.selected_node];
            if (!Number.isFinite(n.parent_id)) { 
                draft.message = "Cannot append a sibling to a top node!";
                return; 
            }
            var parent = draft.table[n.parent_id];
            action.node.id = draft.new_id;
            action.node.parent_id = parent.id;
            action.node.open = true;
            draft.table[action.node.id] = action.node;
            parent.children.push(action.node.id);
            draft.new_id++;
            draft.changed_timestamp = Date.now();
            break;
        case "open-node": 
            draft.table[action.id].open = true;
            draft.changed_timestamp = Date.now();
            break;
        case "close-node": 
            draft.table[action.id].open = false;
            draft.changed_timestamp = Date.now();
            break;
        case "zoom-node":
            draft.top_node = action.id;
            draft.changed_timestamp = Date.now();
            break;
        case "zoom-focus-node":
            draft.top_node = action.id;
            draft.selected_node = action.id;
            draft.changed_timestamp = Date.now();
            console.log(current(draft));
            break;
        case "select-by-id": 
            draft.selected_node = action.id
            draft.changed_timestamp = Date.now();
            break;
        case "set-description":
            if (!draft.table[draft.selected_node]) {
                draft.message = "Cannot set-description if there isn't a selected node";
                break;
            }
            var idx = draft.selected_node;
            draft.table[idx].description = action.description;
            draft.changed_timestamp = Date.now();
            break;
        case "link-child":
            if (draft.table[draft.selected_node].children.indexOf() > -1) {
                draft.message = "Child already exists in node #" + draft.selected_node;
                break;
            }
            draft.table[draft.selected_node].children.push(action.id);
            break;
        case "unlink-child":
            var sel = draft.table[draft.selected_node];
            var del_idx = sel.children.indexOf(action.id);
            sel.children.splice(del_idx, 1);
            break;
        case "reparent":
            var sel = draft.table[draft.selected_node];
            var new_par = draft.table[action.id];
            var old_par = draft.table[sel.parent_id];
            var old_sel_idx = old_par.children.indexOf(sel.id);
            old_par.children.splice(old_sel_idx, 1);
            sel.parent_id = new_par.id;
            console.log(action.id);
            new_par.children.push(sel.id);
            break;
        case "move-over":
            // over{ id }
            // Place selected before target in parent
            var sel = draft.table[draft.selected_node];
            var sel_parent = draft.table[sel.parent_id];
            if (sel_parent == null) {
                draft.message = "Cannot move top-level node";
                return;
            }
            var sel_idx = sel_parent.children.indexOf(sel);
            // Remove
            sel_parent.children.splice(sel_idx, 1);
            var n = draft.table[action.id];
            var parent = draft.table[n.parent_id];
            var nidx = parent.children.indexOf(n);
            parent.children.splice(nidx, 0, sel.id);
            draft.changed_timestamp = Date.now();
            break;
        case "move-under":
            // under{ id }
            // Place selected after target in parent
            var sel = draft.table[draft.selected_node];
            var sel_parent = draft.table[sel.parent_id];
            if (sel_parent == null) {
                draft.message = "Cannot move top-level node";
                break;
            }
            var n = draft.table[action.id];
            var parent = draft.table[n.parent_id];
            var nidx = parent.children.indexOf(n);
            parent.children.splice(nidx + 1, 0, sel.id);
            draft.outline = draft.table[0];
            draft.changed_timestamp = Date.now();
            break;
        default:
            break;
    }
});
