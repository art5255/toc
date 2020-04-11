import "@babel/polyfill";
import "./scss/index.scss";
import React from "react";
import {render} from "react-dom";
import TableOfContentsContainer from "@components/toc/TableOfContentsContainer";

const root = document.getElementById("app");
render(
    (
        <div className="wrapper">
            <TableOfContentsContainer/>
            <div className="content">
                Content
            </div>
        </div>
    ),
    root,
);
