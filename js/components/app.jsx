import {h, render} from 'preact';
import {Link} from 'preact-router';
import {useState,  useEffect, useCallback} from 'preact/hooks';
import {newOutline} from "../reducers/outline";

export function App(props) {
    let [toggle, setToggle] = useState(false);
    let [docs, setDocs] = useState([]);
    let [newDocName, setNewDocName] = useState("");
    useEffect(() => {
        fetch("/documents").
            then(resp => resp.json()).
            then(data => setDocs(data));
    }, [toggle]);

    function createDoc() {
        fetch("/documents", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: newDocName,
                outline: newOutline(newDocName, null, Date.now()),
            })
        }).then(() => {
            setToggle((t) => !t);
            setNewDocName("");
        });
    }
    
    return (
        <div>
        <h2>Tree Outliner</h2>
        {docs.map(d => {
            return <h3><Link href={"/outline/" + d.id}>{d.name}</Link></h3>
        })}
            <form onSubmit={(e) => {
                e.preventDefault();
                createDoc();
            }} >
                <input type="text" value={newDocName} onKeyup={watchNewSave} onInput={(e) => { setNewDocName(e.target.value); return true;}}/>
            </form>
        </div>
    );
}
