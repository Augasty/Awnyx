import { lazy, Suspense } from "react";
import { useProjectContexts } from "../../utils/ProjectContexts";

const StoryList = lazy(() => import("../stories/StoryList/StoryList"));
const TaskList = lazy(() => import("../tasks/TaskList/TaskList"));

const Dashboard = () => {
  const { isProjectPlanner } = useProjectContexts();

  const SelectedComponent = isProjectPlanner ? StoryList : TaskList;

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SelectedComponent />
      </Suspense>
    </div>
  );
};

export default Dashboard;