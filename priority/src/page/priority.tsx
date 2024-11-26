import "./priority.css"
import Task from "../types/types"
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useDisclosure } from '@mantine/hooks';
import { ToastContainer, toast } from 'react-toastify';
import { Card, Text, Badge, Button, Group, Paper, Modal, Checkbox, TextInput, Textarea, Select, Image, HoverCard, Collapse, Popover } from '@mantine/core';

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Main() {    
    const [opened, { open, close }] = useDisclosure(false);
    const [openedCompleted, { toggle }] = useDisclosure(false);
    const [tasks, setTasks] = useState<Task[]>([])
    const [completedTasks, setCompletedTasks] = useState<Task[]>([])

    const [taskTitle, setTaskTitle] = useState<string>("");
    const [taskDesc, setTaskDesc] = useState<string>("");
    const [taskPriority, setTaskPriority] = useState<string | null>("");

    const getTimeToMidnight = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0); // Set time to midnight of the current day
        const difference = midnight.getTime() - now.getTime(); // Time difference in milliseconds
    
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
    
        return { hours, minutes, seconds };
    }

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeToMidnight());

    const convertPriorityToNumber = (stringNum: string | null): number => {
        if (stringNum == "4 - Most priority") {
            return 4;
        } else if (stringNum == "3") {
            return 3;
        } else if (stringNum == "2") {
            return 2;
        }
        return 1;
    }

    const verifyCreateTask = () => {
        let taskUserError = false;
        if (taskTitle == "") {
            taskUserError = true;
            toast.error("Task Title cannot be empty!");
        } 
        if (taskDesc == "") {
            taskUserError = true;
            toast.error("Task Description cannot be empty!");
        }
        if (taskPriority == null || taskPriority == "") {
            taskUserError = true;
            toast.error("Please select a Priority! >:(");
        }
        if (taskUserError) {
            return;
        }

        let id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        let task: Task = {
            task_name: `${taskTitle}`,
            task_description: `${taskDesc}`,
            task_priority: convertPriorityToNumber(taskPriority),
            task_completed: false,
            task_id: id
        }
        let newTaskArray: Task[] = [...tasks, task];
        setTasks(newTaskArray.sort((a, b) => b.task_priority - a.task_priority));
        toast.success("Successfully Created Task!")
        setTaskTitle("");
        setTaskDesc("");
        setTaskPriority("");
        close();

        return;
    }

    const setTaskAsComplete = (taskId: string) => {
        const index = tasks.findIndex(task => task.task_id === taskId);
        if (index !== -1) {
            let newCompletedTaskArray: Task[] = [...completedTasks, tasks[index]];
            setCompletedTasks(newCompletedTaskArray.sort((a, b) => b.task_priority - a.task_priority));
            tasks.splice(index, 1);
        }
        return;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeToMidnight());
         }, 1000); // Update every second
      
          return () => clearInterval(timer); // Cleanup on component unmount
    }, [tasks])

    const setUIPriority = (priority: number) => {
        let badge_color: string = "rgba(209, 209, 209, 1)";
        if (priority >= 4) {
            badge_color = "pink";
        } else if (priority == 3) {
            badge_color = "yellow";
        } else if (priority == 2) {
            badge_color = ""; // Blue is default
        }
        return (
        <Badge style={{marginTop: 10}} color={badge_color} size="md">
            {"Pr: "+ priority}
        </Badge>
        );
    }

    return(
        <>
            <ToastContainer />
            <Paper shadow="xl" radius="md" withBorder p="xl">
                <div id="nav-container">
                    <div className="top-quadrant">
                        <div style={{textAlign: "center", fontSize: "1.4rem", fontWeight: 200}}>
                            {timeLeft.hours.toString().padStart(2, '0')}:
                            {timeLeft.minutes.toString().padStart(2, '0')}:
                            {timeLeft.seconds.toString().padStart(2, '0')}
                        </div>
                    </div>
                    <div className="top-quadrant" style={{textAlign: "center"}}>
                        <h2>#Everyday</h2>
                    </div>
                    <div className="top-quadrant" style={{textAlign: "right"}}>
                        <Button variant="filled" onClick={open}>Add Task</Button>
                    </div>
                </div>
                {
                    (tasks.length != 0) 
                    ? 
                    tasks.map((e) => {
                        return(
                            <div key={e.task_id}>
                                <Card style={{margin: 10}} shadow="xs" padding="xs" radius="md" withBorder>            
                                    <Group justify="space-between" mt="md" mb="xs">
                                        <Text fw={500}>{e.task_name}</Text>
                                        <Checkbox
                                            color="cyan"
                                            radius="sm"
                                            size="md"
                                            onChange={() => setTaskAsComplete(e.task_id)}
                                        />
                                    </Group>
                
                                    <Text size="sm" c="dimmed">{e.task_description}</Text>
                                    <div style={{display: "flex", width: "100%", alignItems: "last baseline", justifyContent: "space-between"}}>
                                        {setUIPriority(e.task_priority)}
                                        <Text size="xs" style={{color: "#D3D3D3"}}>{e.task_id}</Text>
                                    </div>
                                </Card>
                            </div>
                        );
                    })
                    :
                    <> 
                        <div style={{color: "#D3D3D3", textAlign: "center"}}>
                            <p>- Wow pretty empty here... -</p>
                        </div>
                    </>
                }
                {
                    (completedTasks.length != 0) ? 
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Button onClick={toggle} color={"#D3D3D3"} variant="white" style={{height: 20 }}>
                            <span
                                style={{
                                display: 'inline-block',
                                transition: 'transform 0.3s ease',
                                transform: openedCompleted ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                            >
                                ↓
                            </span>
                        </Button>
                        <Collapse in={openedCompleted}>
                            {
                                completedTasks.map((e) => {
                                    return(
                                        <div key={e.task_id}>
                                            <Popover width={150} position="left" withArrow shadow="md">
                                            <Popover.Target>
                                            <Card style={{margin: 10}} shadow="xs" padding="xs" radius="md" withBorder>            
                                                <Group justify="space-between" mt="md" mb="xs">
                                                    <Text fw={500}>{e.task_name}</Text>
                                                    <Checkbox
                                                        disabled={true}
                                                        checked={true}
                                                        color="cyan"
                                                        radius="sm"
                                                        size="md"
                                                    />
                                                </Group>
                            
                                                <Text size="sm" c="dimmed">{e.task_description}</Text>
                                                <div style={{display: "flex", width: "100%", alignItems: "last baseline", justifyContent: "space-between"}}>
                                                    {setUIPriority(e.task_priority)}
                                                    <Text size="xs" style={{color: "#D3D3D3"}}>{e.task_id}</Text>
                                                </div>
                                            </Card>
                                            </Popover.Target>
                                                <Popover.Dropdown style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                                                    <Button variant="filled" size="xs" style={{margin: 2}}>Restore Task</Button>
                                                    <Button variant="filled" color="red" size="xs" style={{margin: 2}}>Delete Task</Button>
                                                </Popover.Dropdown>
                                            </Popover>
                                        </div>
                                    );
                                })
                            }
                        </Collapse>
                    </div>
                    
      
                    :
                    <></>
                }
            </Paper>
            
            {/* Modal View */}
            <Modal opened={opened} onClose={close} centered={true} title="Add A Task 🚀">
                <TextInput
                    label="Task Title"
                    withAsterisk
                    description="What do you want to do?"
                    placeholder="Go drinking with friends! 🍺"
                    value={taskTitle}
                    onChange={(event) => setTaskTitle(event.currentTarget.value)}
                />
                <Textarea
                    autosize
                    label="Task Description"
                    withAsterisk
                    description="Tell me the awesome thing you want to accomplish!"
                    placeholder="Buy a round for everyone! Catch up with some friends! Maybe talk to a cute girl... 🤤"
                    style={{marginTop: 15}}
                    maxRows={10}
                    minRows={10}
                    value={taskDesc}
                    onChange={(event) => setTaskDesc(event.currentTarget.value)}
                />
                <div style={{display: "flex", marginTop: 30, justifyContent: "space-between", alignItems: "center"}}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <HoverCard width={340} shadow="md" position="left-end" offset={20}>
                            <HoverCard.Target>
                                <Image
                                    w={20}
                                    h={20}
                                    radius="xs"
                                    src="/help-octagon.svg"
                                    style={{marginRight: 10}}
                                />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Group>
                                    <div className="hover-card-div">
                                        <Text size="lg" fw={500}>
                                            The Eisenhower Matrix
                                        </Text>
                                    </div>
                                    <div className="hover-card-div">
                                        <Image
                                            w={300}
                                            h={250}
                                            radius="md"
                                            src="https://assets.asana.biz/transform/30c95d26-15e1-4df1-9655-27b28186f0f2/inline-leadership-eisenhower-matrix-2-2x"
                                        />
                                    </div>
                                    <div className="hover-card-div">
                                        <Text size="sm" style={{textAlign: "center"}}> 
                                            The Eisenhower Matrix is a way to organize tasks by urgency and importance,
                                            so you can effectively prioritize your most important work. 
                                            The following priorities (1-4) are based on the Eisenhower matrix. 
                                            Once a task is set (from 1-4), after each time cycle, priorities increase linearly. 
                                        </Text>
                                    </div>
                                </Group>
                            </HoverCard.Dropdown>
                        </HoverCard>
                        <Select
                            size="xs"
                            placeholder="Pick a Priority"
                            style={{width: "60%"}}
                            data={['4 - Most priority', '3', '2', '1 - Least priority']}
                            value={taskPriority} 
                            onChange={setTaskPriority}
                        />
                    </div>
                    <Button variant="filled" onClick={verifyCreateTask}>Create Task!</Button>
                </div>
            </Modal>
        </>
        
    )
}