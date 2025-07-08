import { useComponentsStore } from "../../stores/components";
import { Editor, type OnMount } from "@monaco-editor/react";

export default function Source() {
  const { components } = useComponentsStore();
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };
  return (
    <Editor
      height={"100%"}
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
  );
}
