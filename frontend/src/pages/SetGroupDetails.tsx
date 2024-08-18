import React from "react";
import { useLocation } from "react-router-dom";
import SetContainer from "../components/Containers/SetContainer";
import SetForm from "../components/Forms/SetForm";
import Banner from "../components/UI/Banner";
import useSets from "../hooks/useSets";

const SetGroupDetails: React.FC = () => {
  const location = useLocation();
  const setGroupId: number = location.state?.setGroupId;

  const {
    sets,
    error,
    formState,
    selectedSet,
    setFormState,
    setSelectedSet,
    handleCreateSet,
    handleUpdateSet,
    handleDeleteSet,
  } = useSets({ setGroupId });

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-50 dark:bg-gray-900">
      <Banner>Track</Banner>
      <div className="max-w-[40vw] mt-2 border-2 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 w-full flex flex-col">
        <SetForm
          formState={formState}
          selectedSet={selectedSet}
          setFormState={setFormState}
          setSelectedSet={setSelectedSet}
          handleCreateSet={handleCreateSet}
          handleUpdateSet={handleUpdateSet}
          handleDeleteSet={handleDeleteSet}
        />
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <SetContainer
            sets={sets}
            setSelectedSet={setSelectedSet}
            setFormState={setFormState}
            selectedSet={selectedSet}
          />
        </div>
      </div>
    </div>
  );
};

export default SetGroupDetails;
