function doc(val) {
    return {type: "doc", val: val};
}

function ui(val) {
    return {type: "ui", val: val};
}

export function showMessage(message) {
    return ui({
        cmd: "show-message",
        message: message,
    });
}

export function addChild(description) {
    return doc({
        cmd: "add-child",
        node: {
            id: 0,
            description: description,
            children:  []
        },
    });
}

export function appendSibling(description) {
    return doc({
        cmd: "append-sibling",
        node: {
            id: 0,
            description: description,
            children: []
        },
    });
}

export function zoomNode(id) {
    if (Number.isNaN(Number.parseInt(id, 10))) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "zoom-node",
        id: id,
    });
}

export function selectById(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "select-by-id",
        id: nid,
    });
}

export function setDescription(description) {
    return doc({
        cmd: "set-description",
        description: description
    });
}

export function openNode(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "open-node",
        id: nid,
    });
}

export function closeNode(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "close-node",
        id: nid,
    });
}

export function moveOver(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "move-over",
        id: nid,
    });
}

export function moveUnder(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "move-under",
        id: nid,
    });
}

export function reparent(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "reparent",
        id: nid,
    });
}

export function linkChild(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "link-child",
        id: nid,
    });
}

export function unlinkChild(id) {
    let nid = Number.parseInt(id, 10);
    if (Number.isNaN(nid)) {
        return showMessage("Could not parse " + id + " as an id");
    }
    return doc({
        cmd: "unlink-child",
        id: nid,
    });
}

