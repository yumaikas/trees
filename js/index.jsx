import {h, render} from 'preact';
import {Router} from 'preact-router';
import {Link} from 'preact-router/match';
import {NetworkedOutline} from "./components/outline";
import {App} from "./components/app";
import {newOutline, outlineDb } from "./reducers/outline";
import {createHashHistory} from 'history';


/*
 * This is potential test data
let data = newOutline("Test Outline", "", Date.now());
data = outlineDb(data, addChild("1. Test"));
data = outlineDb(data, addChild("2. Terp"));
data = outlineDb(data, addChild("3. Boss"));
data = outlineDb(data, selectById("2"));
data = outlineDb(data, addChild("2.1 lerp"))
data = outlineDb(data, addChild("2.2 clerp"))
data = outlineDb(data, selectById("0"))
window.data = data;
window.outlineDb = outlineDb;
*/

const Main = (<Router history={createHashHistory()}>
    <App path="/" />
    <NetworkedOutline path="/outline/:docId"/>
</Router>);

let el = document.querySelector("#app");
el.innerHTML = "";
render(Main, document.querySelector("#app"));


