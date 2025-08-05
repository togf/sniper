import { storage } from "@vendetta/plugin";
import { Forms } from "@vendetta/ui/components";

const { FormText, FormRow, FormSwitch, FormInput, FormSlider } = Forms;

export default ({ startSniper, stopSniper }) => {
    return (
        <>
            <FormText style={{ marginBottom: 10 }}>
                Configure your sniper options below. Then run <FormText style={{ fontWeight: "bold" }}>/startchecker</FormText> from any channel to begin checking.
            </FormText>

            <FormSwitch
                label="Watch 4-letter usernames"
                value={!!storage.watch4l}
                onValueChange={(v) => (storage.watch4l = v)}
            />
            <FormSwitch
                label="Watch 3-character usernames"
                value={!!storage.watch3c}
                onValueChange={(v) => (storage.watch3c = v)}
            />
            <FormInput
                title="Custom List (comma-separated)"
                placeholder="e.g. sob,cry,ts,aaa"
                value={storage.customList || ""}
                onChange={(v) => (storage.customList = v)}
            />
            <FormInput
                title="Your Discord Token"
                placeholder="Paste token here"
                value={storage.token || ""}
                onChange={(v) => (storage.token = v)}
            />
            <FormSlider
                title="Check interval (seconds)"
                minValue={10}
                maxValue={300}
                value={storage.interval || 30}
                onValueChange={(v) => (storage.interval = v)}
                markers={[10, 30, 60, 120, 300]}
            />
        </>
    );
};
