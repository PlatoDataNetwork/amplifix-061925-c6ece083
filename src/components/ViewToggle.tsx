import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  view: "card" | "list";
  onViewChange: (view: "card" | "list") => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/50 p-1 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("card")}
        className={`gap-2 ${view === "card" ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white" : "hover:bg-blue-500/10 hover:text-blue-500"}`}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Cards</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("list")}
        className={`gap-2 ${view === "list" ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white" : "hover:bg-blue-500/10 hover:text-blue-500"}`}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
