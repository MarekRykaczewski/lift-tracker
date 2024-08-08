import RecordsTable from "../components/RecordsTable";

const Records = () => {
  return (
    <div>
      <h1 className="font-bold flex items-center px-2 justify-center gap-3 text-center w-full text-2xl py-3 dark:bg-gray-700 bg-gray-200 text-black dark:text-white border-b-4 border-sky-500 ">
        Records
      </h1>
      <RecordsTable />
    </div>
  );
};

export default Records;
