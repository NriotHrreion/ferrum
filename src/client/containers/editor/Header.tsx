import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import { EditorHeaderProps, EditorHeaderState } from "../../types";
import Emitter from "../../utils/emitter";

const Header: React.FC<EditorHeaderProps> = (props) => {
    const [state, setState] = useState<EditorHeaderState>({ hasChanged: false });

    useEffect(() => {
        Emitter.get().on("fileStatusChange", (hasChanged: boolean) => {
            setState({ hasChanged });
        });
    });

    return (
        <header className="header-container">
            <h1>Ferrum 文本编辑器</h1>
            {/* <p>路径: {this.props.path} <span style={{display: this.state.hasChanged ? "inline-block" : "none"}}>(*已编辑)</span></p> */}
            <div className="status-bar">
                <span id="file-path">路径: {props.path}</span>
                <span id="file-edited" style={{display: state.hasChanged ? "inline-block" : "none"}}>(*已编辑)</span>
            </div>
            <Button className="control-button" onClick={props.onSaveFile}>保存 (S)</Button>
            <Button className="control-button" onClick={props.onUndo}>撤销 (Z)</Button>
        </header>
    );
}

export default Header;
