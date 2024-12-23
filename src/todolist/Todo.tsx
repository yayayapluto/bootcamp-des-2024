import { ChangeEvent, useState } from "react"
import { Task } from "./Task"

type TodoProp = {
    task: Task,
    color?: string
    toggleHandle: (taskId: number) => void,
    colorHandle: (taskId: number, colorRgb: string) => void,
    deleteHandle: (taskId: number) => void,
}

export default function Todo({ task, color = "#F9FAFB", toggleHandle, deleteHandle, colorHandle }: TodoProp) {
    const [currentColor, setCurrentColor] = useState(task.color || color); // Menggunakan warna dari task jika ada

    let colorChangeHandler = (e: ChangeEvent<HTMLInputElement>, taskId: number) => {
        const newColor = e.currentTarget.value;
        setCurrentColor(newColor);
        colorHandle(taskId, newColor); // Memperbarui warna di parent
    }

    let currentOpacity = task.isCompleted ? 0.5 : 1;

    return (
        <div style={{ backgroundColor: currentColor, display: "flex", alignItems: "center", gap: "10px", border: "3px solid #000", margin: "10px", justifyContent: "space-between", padding: "0px 10px", opacity: currentOpacity, fontSize: "18px" }}>
            <input type="checkbox" checked={task.isCompleted} onChange={() => toggleHandle(task.id)} />
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                {task.isCompleted ? <del>{task.name}</del> : task.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input type="color" value={currentColor} onChange={(e: ChangeEvent<HTMLInputElement>) => colorChangeHandler(e, task.id)} />
                <button onClick={() => deleteHandle(task.id)} style={{ padding: "8px", border: "2px solid #000", fontSize: "16px" }}>Hapus</button>
            </div>
        </div>
    );
}
