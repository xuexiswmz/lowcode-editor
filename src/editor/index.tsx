import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "../components/Header";
import Marerial from "../components/Marerial";
import Setting from "../components/Setting";
import EditArea from "../components/EditArea";
export default function LowcodeEditor() {
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-[60px] flex items-center border-b-[2px] border-[#a8a2a2]">
        <Header />
      </div>
      <Allotment>
        <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
          <Marerial />
        </Allotment.Pane>
        <Allotment.Pane>
          <EditArea />
        </Allotment.Pane>
        <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
          <Setting />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
