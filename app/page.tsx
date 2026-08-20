import DemoFormWithInput from "./demo-form-with-input";
import DemoFormWithSelect from "./demo-form-with-select";
import DemoFormNativeSelect from "./demo-form-native-select";
import DemoFormSelectNoContent from "./demo-form-select-no-content";

export default function Page() {
  return (
    <div className="p-8 flex gap-3 flex-wrap">
      <DemoFormWithInput />
      <DemoFormWithSelect />
      <DemoFormNativeSelect />
      <DemoFormSelectNoContent />
    </div>
  );
}
