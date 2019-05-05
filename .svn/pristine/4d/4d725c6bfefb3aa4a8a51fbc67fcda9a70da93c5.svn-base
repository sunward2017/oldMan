import React, { Component } from 'react';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Ueditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState:EditorState.createEmpty(),
        }
    }
    componentDidMount(){
        var value = this.props.value||'';
        const contentBlock = htmlToDraft(value)
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({editorState})
    }
    onEditorStateChange = (editorState) => {
        var ctx = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({editorState})
        this.props.onChange(ctx)

    };

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="editor-content"
                onEditorStateChange={this.onEditorStateChange}
            />
        )
    }
}


export default Ueditor