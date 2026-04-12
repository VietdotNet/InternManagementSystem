import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useListPrograms } from "@/lib/api-client-react";

export function ReviewsFilter({ filters, onFilterChange }) {
  const { data: programs } = useListPrograms();

  return (
    <div className="border rounded-lg p-4 bg-white mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">Filter</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Program Track</label>
          <Select
            value={filters.trackId || "all"}
            onValueChange={(v) => onFilterChange("trackId", v === "all" ? "" : v)}
          >
            <SelectTrigger data-testid="select-filter-track">
              <SelectValue placeholder="-- All Tracks --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">-- All Tracks --</SelectItem>
              {programs?.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Trạng thái</label>
          <Select
            value={filters.status || "All"}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger data-testid="select-filter-status">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Passed">Passed</SelectItem>
              <SelectItem value="NotPassed">NotPassed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Lượt kiểm tra</label>
          <Select
            value={filters.attempt || "All"}
            onValueChange={(v) => onFilterChange("attempt", v === "All" ? "" : v)}
          >
            <SelectTrigger data-testid="select-filter-attempt">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="1">Lần 1</SelectItem>
              <SelectItem value="2">Lần 2</SelectItem>
              <SelectItem value="3">Lần 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              placeholder="Lesson / Intern name..."
              value={filters.search || ""}
              onChange={(e) => onFilterChange("search", e.target.value)}
              data-testid="input-filter-search"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
