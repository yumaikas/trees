import {h, render} from 'preact';
import {Link} from 'preact-router';
import marked, {parseInline} from "marked";
import Markup from 'preact-markup';
import {useState, useReducer, useEffect, useCallback} from 'preact/hooks';
import { outlineDb, } from "../reducers/outline";
import { runUi, uiInitState } from "../reducers/ui";
import {
    addChild,
    appendSibling,
    zoomNode,
    selectById,
    setDescription,
    moveOver,
    moveUnder,
    reparent,
    openNode,
    closeNode,
    linkChild,
    unlinkChild,
    showMessage
} from "../reducers/actions";

function lexStr(str) {
    var output = [];
    let inStr = false;
    let inBrackets = false;
    let bracketDepth = 0;
    let tok = "";
    for(let chr of str) {
        if (inBrackets) {
            if (chr === "[") {
                bracketDepth += 1;
                tok += chr;
                continue;
            }
            if (chr === "]") {
                bracketDepth -= 1;
                if (bracketDepth === 0) {
                    output.push(tok);
                    tok = "";
                    continue;
                }
                tok += chr;
                continue;
            }
            tok += chr;
            continue;
        }
        if (inStr) {
            if (chr === '"') {
                output.push(tok);
                tok = "";
                continue;
            }
            tok += chr;
            continue;
        }
        if (chr === "[") {
            inBrackets = true;
            bracketDepth = 1;
            continue;
        }
        if (chr === '"') {
            inStr = true;
            continue;
        }

        if (chr === " "|| chr === "\t" || chr === "\n") {
            output.push(tok);
            tok = "";
            continue;
        }

        tok += chr;
    }
    if (tok.length > 0) {
        output.push(tok);
    }
    return output;
}



export function Node(props) {
    let {
        description,
        id,
        children,
        selected_id,
        node_table,
        open,
    } = props;


    function md(str) {
        if (str.indexOf("\n") > -1) {
            return marked(str);
        }
        return parseInline(str, []);
    }

    if (children.length === 0) {
        return (<div>
            <span style={{"color": "grey", "margin-left": "20px"}}> - #{id}</span> 
                { (selected_id === id ? "*" : null)}:{" "}
                <Markup markup={md(description)} wrap={false} type="html" trim={false}/>
        </div>);
    }

    return (
        <details open={open} style={{"margin-left":"10px"}} >
            <summary>
                <span style={{"color": "grey"}}>#{id}</span> 
             { (selected_id === id ? "*" : null)}:{" "}
                <Markup markup={md(description)} wrap={false} type="html" trim={false}/>
            </summary>
            {(children || []).map(cid => {
                let c = node_table[cid];
                return (<Node 
                    id={cid}
                    open={c.open}
                    selected_id={selected_id}
                    description={c.description}
                    node_table={node_table}
                    children={c.children}
                />)})}
        </details>
    );
}


function buildCmd(input) {
    let maybeCmd = lexStr(input);
    if (input.length < 1) {
        return showMessage("Command needs at least a name and argument!");
    }
    let cmd = maybeCmd;

    let cmdName = cmd[0];
    return  ({
        "a": addChild(cmd.slice(1).join(" ")),
        "d": setDescription(cmd.slice(1).join(" ")),
        "#" : selectById(cmd[1]),
        "." : selectById(cmd[1]),
        "j" : selectById(cmd[1]),
        "mk": appendSibling(cmd[1]),
        "ln": linkChild(cmd[1]),
        "ul": unlinkChild(cmd[1]),
        "rp": reparent(cmd[1]),
        "z" : zoomNode(cmd[1]),
        "c": closeNode(cmd[1]),
        "o": openNode(cmd[1]),
    }[cmdName]) || showMessage("Didn't understand the command?"); 
}

export function NetworkedOutline(props) {
    let {docId} = props;
    let [outline, setOutline] = useState(null);
    let [toggle, setToggle] = useState(false);
    let [error, setError] = useState(null);
    useEffect(() => {
        fetch("/documents/" + docId).then(resp => resp.json())
            .then(resp => setOutline(resp))
            .catch(err => setError(err));
    }, [toggle]);

    let saveOutline = useCallback((newOutline) => {
        fetch("/documents/" + docId, { 
            method: 'POST',
            body: JSON.stringify(newOutline)
        }).catch(err => setError(err));
    }, [docId])

    if (error) {
        return (<div>
            <h3>An error occurred whilen saving or loading the outline.</h3>
            <div><a style={{textDecoration: "underline"}} onClick={
                (e) => {
                    setError(null);
                    setToggle((t) => !t);
                }
            }>Reload?</a>
            </div>
            <div>{error}</div>
            </div>);
    }
    if (!outline) {
        return (<h3>Loading...</h3>);
    }
    return <Outline data={outline} saveOutline={saveOutline} />;
}


export function Outline(props) {
    let {data, saveOutline} = props;
    let [outline, docDispatch] = useReducer(outlineDb, data);
    let [ui, uiDispatch] = useReducer(runUi, uiInitState());
    // Every time the outline changes, save it.
    useEffect(() => {
        if (saveOutline) {
            saveOutline(outline);
        }
    }, [outline]);
    let outline_data = outline.table[outline.top_node];
    let {description, children, id, open} = outline_data;
    let [cliInput, setCliInput] = useState("");

    function dispatch(command) {
        switch (command.type) {
            case "doc": 
                docDispatch(command.val);
                if (ui.message) {
                    // Clear message if it exists
                    uiDispatch({});
                }
                break;
            case "ui":
                uiDispatch(command.val);
        }
    }

    function handleCommandSubmit() {
        dispatch(buildCmd(cliInput));
        setCliInput("");
    }
    let keyup = (e) => {
        if (e.code === "Enter") {
            handleCommandSubmit();
        } 
    };

    let change = (e) => {
        setCliInput(e.target.value);
    };

    return (<div>
        <h2><Link href="/">{description}</Link></h2>
        <Node 
            id={id} 
            description={description} 
            selected_id={outline.selected_node}
            node_table={outline.table}
            open={open}
            children={children}
        />
        <form onSubmit={(e) => {
            e.preventDefault();
            handleCommandSubmit();
        }} >

            <input type="text" name="cli" value={cliInput} onKeyUp={keyup} onInput={change} /> 
        </form>
        <div>{ui.message || ""}</div>
    </div>);
}
