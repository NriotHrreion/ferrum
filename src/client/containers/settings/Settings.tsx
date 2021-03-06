/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import Axios from "axios";
import toast from "react-hot-toast";

import SettingsSection from "./SettingsSection";
import Option from "./Option";
import Toggle from "./Toggle";

import MainContext from "../../contexts/MainContext";
import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
import { apiUrl } from "../../global";
import { Config } from "../../types";

// icons
import folderOutline from "../../../icons/folder_outline.svg";
import editNote from "../../../icons/edit_note.svg";
import terminal from "../../../icons/terminal.svg";

const Settings: React.FC = () => {
    const displayHiddenFileToggle = useRef<Toggle | null>(null);
    const lineNumberToggle = useRef<Toggle | null>(null);
    const autoWrapToggle = useRef<Toggle | null>(null);
    const highlightActiveLineToggle = useRef<Toggle | null>(null);

    const { isDemo, config } = useContext(MainContext);

    function getInputElem(id: string): HTMLInputElement {
        return Utils.getElem(id) as HTMLInputElement;
    }

    const handleSave = () => {
        if(
            !displayHiddenFileToggle.current ||
            !lineNumberToggle.current ||
            !autoWrapToggle.current ||
            !highlightActiveLineToggle.current ||
            isDemo
        ) return;

        var newConfig: Config = {
            explorer: {
                root: getInputElem("settings-root").value,
                password: config.explorer.password,
                displayHiddenFile: displayHiddenFileToggle.current.getStatus()
            },
            editor: {
                lineNumber: lineNumberToggle.current.getStatus(),
                autoWrap: autoWrapToggle.current.getStatus(),
                highlightActiveLine: highlightActiveLineToggle.current.getStatus(),
                fontSize: parseInt((Utils.getElem("settings-font-size") as HTMLSelectElement).value)
            },
            terminal: {
                ip: getInputElem("settings-ip").value,
                port: parseInt(getInputElem("settings-port").value),
                username: getInputElem("settings-username").value,
                password: getInputElem("settings-password").value
            }
        };

        // Only when the config is changed,
        // the app posts the new config to the backend server
        if(!Utils.isObjectEqual<Config>(config, newConfig)) {
            toast.promise(Axios.post(apiUrl +"/setConfig", {
                config: newConfig
            }), {
                loading: "?????????...",
                success: "????????????",
                error: "????????????"
            }).then(() => window.location.reload());
        }
    };

    useEffect(() => {
        // Reset the config list when the user close the dialog
        Emitter.get().on("dialogClose", (dialogId: string) => {
            if(dialogId === "settings") handleSave();
        });

        // Save the config with ctrl+s
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key == "s") {
                e.preventDefault();
                handleSave();
            }
        });
    }, [config]);
    
    return (
        <div className="settings-dialog">
            <Form>
                <SettingsSection title="???????????????" icon={folderOutline}>
                    <Option name="?????????" description="Unix???????????????'(Unix???????????????)'">
                        <Form.Select id="settings-root" defaultValue={config.explorer.root}>
                            <option value="">(Unix???????????????)</option>
                            <option value="C:">C: (??????)</option>
                            <option value="D:">D:</option>
                            <option value="E:">E:</option>
                            <option value="F:">F:</option>
                            <option value="G:">G:</option>
                            <option value="H:">H:</option>
                            <option value="I:">I:</option>
                            <option value="J:">J:</option>
                            <option value="K:">K:</option>
                            <option value="L:">L:</option>
                            <option value="M:">M:</option>
                            <option value="N:">N:</option>
                            <option value="O:">O:</option>
                            <option value="P:">P:</option>
                            <option value="Q:">Q:</option>
                            <option value="R:">R:</option>
                            <option value="S:">S:</option>
                            <option value="T:">T:</option>
                            <option value="U:">U:</option>
                            <option value="V:">V:</option>
                            <option value="W:">W:</option>
                            <option value="X:">X:</option>
                            <option value="Y:">Y:</option>
                            <option value="Z:">Z:</option>
                            <option value="A:">A:</option>
                            <option value="B:">B:</option>
                        </Form.Select>
                    </Option>
                    <Option name="??????????????????">
                        <Toggle ref={displayHiddenFileToggle} id="settings-display-hidden-file" defaultValue={config.explorer.displayHiddenFile}/>
                    </Option>
                </SettingsSection>
                <SettingsSection title="?????????" icon={editNote}>
                    <Option name="????????????">
                        <Toggle ref={lineNumberToggle} id="settings-line-number" defaultValue={config.editor.lineNumber}/>
                    </Option>
                    <Option name="????????????" description="?????????????????????????????????????????????, ????????????">
                        <Toggle ref={autoWrapToggle} id="settings-auto-wrap" defaultValue={config.editor.autoWrap}/>
                    </Option>
                    <Option name="???????????????" description="?????????????????????????????????">
                        <Toggle ref={highlightActiveLineToggle} id="settings-highlight-active-line" defaultValue={config.editor.highlightActiveLine}/>
                    </Option>
                    <Option name="????????????">
                        <Form.Select id="settings-font-size" defaultValue={config.editor.fontSize}>
                            <option value={12}>??????</option>
                            <option value={13}>???</option>
                            <option value={14}>??? (??????)</option>
                            <option value={15}>???</option>
                            <option value={16}>??????</option>
                        </Form.Select>
                    </Option>
                </SettingsSection>
                <SettingsSection title="????????????" icon={terminal}>
                    <Option name="IP ??????">
                        <Form.Control type="text" id="settings-ip" defaultValue={config.terminal.ip}/>
                    </Option>
                    <Option name="??????">
                        <Form.Control type="text" id="settings-port" defaultValue={config.terminal.port}/>
                    </Option>
                    <Option name="?????????">
                        <Form.Control type="text" id="settings-username" defaultValue={config.terminal.username}/>
                    </Option>
                    <Option name="??????">
                        <Form.Control type="password" id="settings-password" autoComplete="off" defaultValue={config.terminal.password}/>
                    </Option>
                </SettingsSection>

                {/* <Button onClick={() => handleSave()}>?????? (S)</Button> */}
            </Form>
        </div>
    );
}

export default Settings;
