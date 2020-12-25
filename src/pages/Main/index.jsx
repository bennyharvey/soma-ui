import React, { useState, useEffect }  from "react"
import { Switch, Route, Link, useParams, useRouteMatch } from "react-router-dom";

const Main = () => {
    let { path, url } = useRouteMatch();

    return (
        <div>
            <h2>Topics</h2>
                <ul>
                <li>
                    <Link to={`main/rendering`}>Rendering with React</Link>
                </li>
                <li>
                    <Link to={`main/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`main/props-v-state`}>Props v. State</Link>
                </li>
            </ul>

            <Switch>
                <Route exact path={path}>
                    <h3>Please select a topic.</h3>
                </Route>
                <Route path={`${path}/:topicId`}>
                    <Topic />
                </Route>
            </Switch>
        </div>
    );
}


function Topic() {
    // The <Route> that rendered this component has a
    // path of `/topics/:topicId`. The `:topicId` portion
    // of the URL indicates a placeholder that we can
    // get from `useParams()`.
    let { topicId } = useParams();

    return (
    <div>
        <h3>{topicId}</h3>
    </div>
    );
}

export default Main;