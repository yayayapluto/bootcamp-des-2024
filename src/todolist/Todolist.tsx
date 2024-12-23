import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Task } from "./Task";
import Todo from "./Todo";

export default function Todolist() {
    const dummyTasks: Task[] = []

    const [_tasks, _setTasks] = useState<Task[]>(dummyTasks)
    const [_currentTaskName, _setCurrentTaskName] = useState<string>("")
    const [_filterStatus, _setFilterStatus] = useState<boolean | null>(null)
    const [_sortField, _setSortField] = useState<"name" | "createdAt">("createdAt")
    const [_sortDirection, _setSortDirection] = useState<"asc" | "desc">("desc")
    const [_searchTerm, _setSearchTerm] = useState<string>("")
    const [_lightMode, _setLightMode] = useState<boolean>(true)

    const _addNewTask = () => {
        _setTasks([
            ..._tasks,
            {
                id: _tasks.length + 1,
                name: _currentTaskName,
                isCompleted: false,
                createdAt: Date.now()
            }
        ])
    }

    const _removeTask = (taskId: number) => {
        _setTasks(prev => prev.filter(task => task.id !== taskId))
    }

    const _toggleTask = (taskId: number) => {
        _setTasks(prev => prev.map(task => task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task))
    }

    const _colorTask = (taskId: number, colorRgb: string) => {
        _setTasks(prev => prev.map(task => task.id === taskId ? { ...task, color: colorRgb } : task));
    }


    const filteredTasks = useMemo(() => {
        let updatedTasks = [..._tasks]

        if (_searchTerm) {
            updatedTasks = updatedTasks.filter(task => task.name.toLowerCase().includes(_searchTerm.toLowerCase()))
            console.log(`Search term: ${_searchTerm}`);
        }

        if (_filterStatus !== null) {
            updatedTasks = updatedTasks.filter(task => task.isCompleted === _filterStatus)
            console.log(`Filter status: ${_filterStatus}`);
        }

        updatedTasks.sort((a, b) => {
            console.log(`Sort field: ${_sortField}, direct: ${_sortDirection}`);
            if (_sortField === "name") {
                return _sortDirection === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                return _sortDirection === "asc"
                    ? a.createdAt - b.createdAt
                    : b.createdAt - a.createdAt;
            }
        });

        
        return updatedTasks
    }, [_tasks, _searchTerm, _filterStatus, _sortField, _sortDirection])

    const colorMode = _lightMode ? "#F9FAFB" : "#35393FFF"

    return (
        <div style={{ width: "100%", height: "100%", fontFamily: "Arial, sans-serif" }}>
            <div style={{ backgroundColor:colorMode, display: "flex", alignItems: "center", gap: "10px", border: "3px solid #000", margin: "10px", justifyContent: "space-between", padding: "20px 10px", fontSize: "16px" }}>
                <input type="text" placeholder="Masukkan nama tugas..." onChange={(e: ChangeEvent<HTMLInputElement>) => _setCurrentTaskName(e.currentTarget.value.trim())} style={{ padding: "8px", border: "2px solid #000", fontSize: "16px" }} />
                <button onClick={_addNewTask} style={{ padding: "8px 16px", border: "2px solid #000", fontSize: "16px" }}>Tambah</button>
            </div>
            <div style={{ backgroundColor: colorMode, display: "flex", alignItems: "center", gap: "5px", border: "3px solid #000", margin: "10px", justifyContent: "space-between", padding: "15px 10px", fontSize: "16px" }}>
                <input type="text" placeholder="Cari nama tugas..." onChange={(e: ChangeEvent<HTMLInputElement>) => _setSearchTerm(e.currentTarget.value.trim())} style={{ padding: "8px", border: "2px solid #000", fontSize: "16px" }} />
                <select onChange={(e: ChangeEvent<HTMLSelectElement>) => _setFilterStatus(e.currentTarget.value === "true" ? true : e.currentTarget.value === "false" ? false : null)} style={{ padding: "8px", border: "2px solid #000", fontSize: "16px" }}>
                    <option value="">Semua</option>
                    <option value="true">Selesai</option>
                    <option value="false">Belum selesai</option>
                </select>
                <select onChange={(e: ChangeEvent<HTMLSelectElement>) => _setSortField(e.currentTarget.value === "name" ? "name" : "createdAt")} style={{ padding: "8px", border: "2px solid #000", fontSize: "16px" }}>
                    <option value="name">Nama</option>
                    <option value="date">Tanggal</option>
                </select>
                <select onChange={(e: ChangeEvent<HTMLSelectElement>) => _setSortDirection(e.currentTarget.value === "asc" ? "asc" : "desc")} style={{ padding: "8px", border: "2px solid #000", fontSize: "16px" }}>
                    <option value="asc">asc</option>
                    <option value="desc">desc</option>
                </select>
                <button onClick={() => _setLightMode(!_lightMode)} style={{ padding: "8px 16px", border: "2px solid #000", fontSize: "16px" }}>{_lightMode ? "Light" : "Dark"} mode</button>
            </div>
            <div style={{ backgroundColor: "inherit"}}>
                {filteredTasks.length !== 0
                    ? filteredTasks.map(task => (
                        <Todo
                            key={`${task.id}-${task.name}`}
                            task={task}
                            toggleHandle={() => _toggleTask(task.id)}
                            deleteHandle={() => _removeTask(task.id)}
                            colorHandle={_colorTask}
                        />
                    ))
                    : <div style={{ backgroundColor:"#F9FAFB", margin:"10px", display: "flex", alignItems: "center", gap: "10px", border: "3px solid #000", justifyContent: "space-between", padding: "0px 10px" }}>
                        <p>Belum ada tugas nih</p>
                    </div>
                }
            </div>
        </div>
    )

}