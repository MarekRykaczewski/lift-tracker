import { Set } from "../../types";
import SetPreview from "../SetPreview";

const SetPreviewContainer = ({ sets }: { sets: Set[] }) => {
  return (
    <>
      {sets.map((set) => (
        <SetPreview set={set} key={set.id} />
      ))}
    </>
  );
};

export default SetPreviewContainer;
