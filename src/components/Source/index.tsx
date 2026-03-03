import { Editor, type OnMount } from "@monaco-editor/react";
import { useComponentsStore } from "../../stores/components";

export default function Source() {
  const { components } = useComponentsStore();

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };

  return (
    <div className="lce-source-panel">
      <Editor
        height="100%"
        path="components.json"
        language="json"
        onMount={handleEditorMount}
        value={JSON.stringify(components, null, 2)}
        options={{
          fontSize: 14,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  );
}
