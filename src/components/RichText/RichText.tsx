import { useState } from 'react';
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs'
import "./RichText.css"
import { IFormInput } from '../FormInput/types';

const RichText = ({ setValue, name, value = '' }: IFormInput) => {
  const initialContent = value.toString();
  const contentBlock = htmlToDraft(initialContent);
  const initialContentState = contentBlock
    ? ContentState.createFromBlockArray(contentBlock.contentBlocks)
    : ContentState.createFromText("");

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(initialContentState)
  );
  const [rawHtml, setRawHtml] = useState<string>(initialContent);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const newHtml = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setRawHtml(newHtml);
    setValue(name, newHtml)
  };

  return (
    <div className="rich-text-container">
      <Editor
        editorState={editorState}
        wrapperClassName="editor-wrapper"
        editorClassName="editor-textarea"
        onEditorStateChange={handleEditorChange}
      />
    </div >
  );
};

export default RichText;
