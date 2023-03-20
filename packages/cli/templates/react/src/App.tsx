import { useFieldPlugin } from "./useFieldPlugin";
import { FunctionComponent } from "react";
import Increment from "./components/Increment";
import ModalToggle from "./components/ModalToggle";
import AssetSelector from "./components/AssetSelector";
import { PluginActions, PluginState } from "@storyblok/field-plugin";

export type FieldPluginFun = FunctionComponent<{
  data: PluginState;
  actions: PluginActions;
}>;

function App() {
  const { type, data, actions } = useFieldPlugin();

  if (type === "loading") {
    return <span>Loading...</span>;
  }

  if (type === "error") {
    return <span>Error</span>;
  }

  const props = {
    data,
    actions,
  };

  return (
    <div className="field-plugin">
      <ModalToggle {...props} />
      <Increment {...props} />
      <AssetSelector {...props} />
    </div>
  );
}

export default App;
